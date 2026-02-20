import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['yjs', 'y-protocols'],
  },
};

export default nextConfig;