/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Configure MDX if needed
  // experimental: {
  // mdxRs: true,
  // },
};

export default nextConfig;
