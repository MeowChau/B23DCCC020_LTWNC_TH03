import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep runtime cache changes in the same process as the in-memory posts.
  experimental: { isrFlushToDisk: false },
};
export default nextConfig;
