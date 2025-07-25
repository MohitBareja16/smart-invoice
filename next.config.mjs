/** @type {import('next').NextConfig} */
const nextConfig = {};
env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // Enable PDF rendering
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
export default nextConfig;
