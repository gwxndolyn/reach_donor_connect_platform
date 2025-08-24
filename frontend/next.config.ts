import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "models.readyplayer.me" }],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. This is not recommended unless you
    // have ESLint configured to run in a separate part of your workflow (for example, in CI).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
