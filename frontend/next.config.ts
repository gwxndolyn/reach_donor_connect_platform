import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "models.readyplayer.me" }],
  },
};

export default nextConfig;
