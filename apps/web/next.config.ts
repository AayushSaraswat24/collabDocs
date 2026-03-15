import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['yjs', 'y-protocols'],
  },
  transpilePackages: ["@collabdoc/db"],
};

export default nextConfig;