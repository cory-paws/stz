/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/data/**/*': ['./src/data/**/*'],
  },
};

export default nextConfig;
