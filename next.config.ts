import { type NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withPWA = withPWAInit({
  dest: "public",
  // disable: process.env.NODE_ENV === "development", // Uncomment this line if you want to disable PWA in development
  register: true,
  // skipWaiting: true, // Removed problematic option
  // cacheOnFrontEndNav: true, // Removed problematic option
  // aggressiveFrontEndNavCaching: true, // Removed problematic option
});

export default withPWA(nextConfig);
