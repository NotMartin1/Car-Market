import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { GetCurrentAuthUserResponse } from "@workspace/api-zod";

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  return NextResponse.json(
    GetCurrentAuthUserResponse.parse({
      isAuthenticated: !!user,
      user: user ?? undefined,
    }),
  );
}
