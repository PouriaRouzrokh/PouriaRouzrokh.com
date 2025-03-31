import { type NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // Configure with specific cloud name in production
      },
    ],
    // Add unoptimized option to allow serving local images that might not be optimal format
    unoptimized: process.env.NODE_ENV === "development",
  },
  // Opt-in to strict mode
  reactStrictMode: true,
  // Enable React 19's new client suspense feature
  experimental: {
    // Enable if you want to try the React Compiler
    // reactCompiler: true,
  },
};

export default config;
