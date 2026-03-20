import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xqfnmfjslrjuoyccsicf.supabase.co",
      },
    ],
  },
};

export default nextConfig;