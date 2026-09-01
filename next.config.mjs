/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
