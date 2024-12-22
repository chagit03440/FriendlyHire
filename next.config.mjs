/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false, // Ignore the 'canvas' module
      fs: false, // Ignore the 'fs' module (file system)
      path: false, // Ignore the 'path' module
    };
    return config;
  },
};

export default nextConfig;
