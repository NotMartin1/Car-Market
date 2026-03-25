import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import {
  getOidcConfig,
  getSessionIdFromRequest,
  deleteSession,
  getOrigin,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const config = await getOidcConfig();
  const origin = getOrigin(request);

  const sid = getSessionIdFromRequest(request);
  if (sid) {
    await deleteSession(sid).catch(() => {});
  }

  const endSessionUrl = oidc.buildEndSessionUrl(config, {
    client_id: process.env.REPL_ID!,
    post_logout_redirect_uri: origin,
  });

  const response = NextResponse.redirect(endSessionUrl.href);
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
