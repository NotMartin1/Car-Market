import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/api-client-react",
    "@workspace/replit-auth-web",
    "@workspace/api-zod",
    "@workspace/db",
  ],
  serverExternalPackages: ["pg", "openid-client"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
