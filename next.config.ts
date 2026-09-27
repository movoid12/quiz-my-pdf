import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  typedRoutes: true,
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
