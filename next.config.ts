import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/main",
        permanent: false,
      },
      {
        source: "/main/:path+",
        destination: "/main",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
