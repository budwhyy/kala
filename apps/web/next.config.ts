import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace packages ship TypeScript source; Next compiles them.
  transpilePackages: ["@kala/schema"],
  reactStrictMode: true,
};

export default nextConfig;
