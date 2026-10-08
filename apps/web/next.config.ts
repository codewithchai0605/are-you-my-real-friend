import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // @repo/db ships TypeScript source (no build step), so Next must compile it.
  transpilePackages: ["@repo/db"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }]
  }
};

export default nextConfig;
