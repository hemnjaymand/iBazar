import type { NextConfig } from "next";
 
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: 'https',
        hostname: 'zejiiqsjopqjqtaemmpw.supabase.co',
        pathname: '/storage/v1/object/**',
      }, 
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
    ],
  },
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "pg-connection-string",
    "pgpass",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        net: false,
        tls: false,
        fs: false,
        "util/types": false,
        "pg-native": false,
        child_process: false,
        // 👇 موارد اضافه برای پایداری بیشتر
        buffer: false,
        path: false,
        url: false,
        stream: false,
        crypto: false,
        async_hooks: false,
        "node:buffer": false,
        "node:path": false,
        "node:url": false,
        "node:stream": false,
        "node:crypto": false,
        "node:async_hooks": false,
      };
    }
    return config;
  },
};

export default nextConfig;