/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // ✅ THIS is required for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
