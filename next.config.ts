import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development"
  },
  turbopack: {}, // Add empty turbopack config to silence the warning
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(nextConfig);