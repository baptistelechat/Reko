import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
    ],
  },
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    TMDB_BASE_URL: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  // Configuration pour la production
  ...(process.env.NODE_ENV === "production" && {
    compiler: {
      removeConsole: true,
    },
  }),
};

// Configuration PWA avec next-pwa
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.themoviedb\.org\/3\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "tmdb-api-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 heures
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "tmdb-images-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

export default withPWA(nextConfig);
