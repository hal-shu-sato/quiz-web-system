import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    esmExternals: 'loose', // required to make Konva & react-konva work
  },
  webpack: (config: { externals: Record<string, string>[] }) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work
    return config;
  },
};

export default nextConfig;
