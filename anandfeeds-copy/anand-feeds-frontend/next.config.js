/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["admin.anandfeeds.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost", // Add this line
        port: "1337",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shielded-mesa-24164-47070bea3ec4.herokuapp.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "anandfeeds.abhinandan.me",
        pathname: "/uploads/**",
      },
      {
        protocol:"https",
        hostname:"admin.anandfeeds.com",
        pathname:"/uploads/**"
      },
      {
        protocol:"https",
        hostname:"admin.anandfeeds.com",
        pathname:"/**"
      }
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
