import type { NextConfig } from "next";

const replitDomain = process.env.REPLIT_DEV_DOMAIN ?? "";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.replit.dev",
    "*.replit.app",
    ...(replitDomain ? [replitDomain] : []),
  ],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
