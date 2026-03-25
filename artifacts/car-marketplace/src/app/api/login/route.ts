import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import { getOidcConfig, getOrigin, getSafeReturnTo } from "@/lib/auth";

const OIDC_COOKIE_TTL = 10 * 60;

export async function GET(request: NextRequest) {
  const config = await getOidcConfig();
  const callbackUrl = `${getOrigin(request)}/api/callback`;
  const returnTo = getSafeReturnTo(request.nextUrl.searchParams.get("returnTo"));

  const state = oidc.randomState();
  const nonce = oidc.randomNonce();
  const codeVerifier = oidc.randomPKCECodeVerifier();
  const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);

  const redirectTo = oidc.buildAuthorizationUrl(config, {
    redirect_uri: callbackUrl,
    scope: "openid email profile offline_access",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    prompt: "login consent",
    state,
    nonce,
  });

  const response = NextResponse.redirect(redirectTo.href);
  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: OIDC_COOKIE_TTL,
  };

  response.cookies.set("code_verifier", codeVerifier, cookieOpts);
  response.cookies.set("nonce", nonce, cookieOpts);
  response.cookies.set("state", state, cookieOpts);
  response.cookies.set("return_to", returnTo, cookieOpts);

  return response;
}
