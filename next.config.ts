import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options can go here */
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**', // This allows any image path from the cdn.sanity.io hostname
      },
    ],
  },
};

export default nextConfig;