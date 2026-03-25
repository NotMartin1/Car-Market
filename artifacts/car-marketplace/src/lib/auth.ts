import * as client from "openid-client";
import crypto from "crypto";
import { db, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { User } from "@workspace/api-zod";
import type { NextRequest, NextResponse } from "next/server";

export const ISSUER_URL = process.env.ISSUER_URL ?? "https://replit.com/oidc";
export const SESSION_COOKIE = "sid";
export const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

export interface SessionData {
  user: User;
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

let oidcConfig: client.Configuration | null = null;

export async function getOidcConfig(): Promise<client.Configuration> {
  if (!oidcConfig) {
    oidcConfig = await client.discovery(
      new URL(ISSUER_URL),
      process.env.REPL_ID!,
    );
  }
  return oidcConfig;
}

export async function createSession(data: SessionData): Promise<string> {
  const sid = crypto.randomBytes(32).toString("hex");
  await db.insert(sessionsTable).values({
    sid,
    sess: data as unknown as Record<string, unknown>,
    expire: new Date(Date.now() + SESSION_TTL),
  });
  return sid;
}

export async function getSession(sid: string): Promise<SessionData | null> {
  const [row] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.sid, sid));

  if (!row || row.expire < new Date()) {
    if (row) await deleteSession(sid);
    return null;
  }

  return row.sess as unknown as SessionData;
}

export async function updateSession(
  sid: string,
  data: SessionData,
): Promise<void> {
  await db
    .update(sessionsTable)
    .set({
      sess: data as unknown as Record<string, unknown>,
      expire: new Date(Date.now() + SESSION_TTL),
    })
    .where(eq(sessionsTable.sid, sid));
}

export async function deleteSession(sid: string): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.sid, sid));
}

export function getSessionIdFromRequest(request: NextRequest): string | undefined {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get(SESSION_COOKIE)?.value;
}

export async function getSessionUser(request: NextRequest): Promise<User | null> {
  const sid = getSessionIdFromRequest(request);
  if (!sid) return null;

  const session = await getSession(sid);
  if (!session?.user?.id) return null;

  const now = Math.floor(Date.now() / 1000);
  if (session.expires_at && now > session.expires_at && session.refresh_token) {
    try {
      const config = await getOidcConfig();
      const tokens = await client.refreshTokenGrant(config, session.refresh_token);
      session.access_token = tokens.access_token;
      session.refresh_token = tokens.refresh_token ?? session.refresh_token;
      session.expires_at = tokens.expiresIn() ? now + tokens.expiresIn()! : session.expires_at;
      await updateSession(sid, session);
    } catch {
      await deleteSession(sid);
      return null;
    }
  }

  return session.user;
}

export function clearSessionCookie(response: NextResponse, sid?: string): void {
  if (sid) {
    deleteSession(sid).catch(() => {});
  }
  response.cookies.delete(SESSION_COOKIE);
}

export function getOrigin(request: NextRequest): string {
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "localhost";
  return `${proto}://${host}`;
}

export function getSafeReturnTo(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
