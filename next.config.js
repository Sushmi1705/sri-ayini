/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // ❌ Commented out to fix "API Routes cannot be used with output: export"
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
