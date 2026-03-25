import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import { db, usersTable } from "@workspace/db";
import {
  getOidcConfig,
  createSession,
  getSafeReturnTo,
  getOrigin,
  SESSION_COOKIE,
  SESSION_TTL,
} from "@/lib/auth";
import type { SessionData } from "@/lib/auth";

async function upsertUser(claims: Record<string, unknown>) {
  const userData = {
    id: claims.sub as string,
    username: (claims.username || claims.preferred_username || claims.sub) as string,
    email: (claims.email as string) ?? null,
    firstName: (claims.first_name as string) ?? null,
    lastName: (claims.last_name as string) ?? null,
    profileImageUrl: (claims.profile_image_url || claims.picture) as string | null,
  };

  const [user] = await db
    .insert(usersTable)
    .values(userData)
    .onConflictDoUpdate({
      target: usersTable.id,
      set: { ...userData, updatedAt: new Date() },
    })
    .returning();
  return user;
}

export async function GET(request: NextRequest) {
  const config = await getOidcConfig();
  const callbackUrl = `${getOrigin(request)}/api/callback`;

  const codeVerifier = request.cookies.get("code_verifier")?.value;
  const nonce = request.cookies.get("nonce")?.value;
  const expectedState = request.cookies.get("state")?.value;
  const returnTo = getSafeReturnTo(request.cookies.get("return_to")?.value ?? null);

  if (!codeVerifier || !expectedState) {
    return NextResponse.redirect(new URL("/api/login", request.url));
  }

  const searchParams = request.nextUrl.searchParams;
  const currentUrl = new URL(
    `${callbackUrl}?${searchParams.toString()}`,
  );

  let tokens: oidc.TokenEndpointResponse & oidc.TokenEndpointResponseHelpers;
  try {
    tokens = await oidc.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: codeVerifier,
      expectedNonce: nonce,
      expectedState,
      idTokenExpected: true,
    });
  } catch {
    return NextResponse.redirect(new URL("/api/login", request.url));
  }

  const claims = tokens.claims();
  if (!claims) {
    return NextResponse.redirect(new URL("/api/login", request.url));
  }

  const dbUser = await upsertUser(claims as unknown as Record<string, unknown>);

  const now = Math.floor(Date.now() / 1000);
  const sessionData: SessionData = {
    user: {
      id: dbUser.id,
      username: dbUser.username ?? dbUser.id,
      firstName: dbUser.firstName ?? undefined,
      lastName: dbUser.lastName ?? undefined,
      profileImageUrl: dbUser.profileImageUrl ?? undefined,
    },
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: tokens.expiresIn() ? now + tokens.expiresIn()! : (claims.exp as number | undefined),
  };

  const sid = await createSession(sessionData);
  const response = NextResponse.redirect(new URL(returnTo, request.url));

  response.cookies.set(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL / 1000,
  });

  response.cookies.delete("code_verifier");
  response.cookies.delete("nonce");
  response.cookies.delete("state");
  response.cookies.delete("return_to");

  return response;
}
