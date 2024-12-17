/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false, // Ignore the 'canvas' module
      };
      return config;
    },
  };
  
  export default nextConfig;
  