import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/static/index.html",
        has: [{ type: "header", key: "accept", value: "(?!application/json)" }],
      },
    ];
  },
};

export default nextConfig;
