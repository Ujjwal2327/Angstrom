import { withHydrationOverlay } from "@builder.io/react-hydration-overlay/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    // Use in-memory cache only in development
    if (process.env.NODE_ENV === 'development') {
      config.cache = {
        type: 'memory', // Use in-memory cache
      };
    } else {
      // Optionally, you can configure disk caching for production or leave it as is
      config.cache = false; // or provide a different caching strategy
    }

    return config; // Return the modified config
  },
};

// Apply the hydration overlay with the given configuration
export default withHydrationOverlay({
  appRootSelector: "main",
})(nextConfig);
