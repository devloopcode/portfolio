import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options",            value: "nosniff" },
  // Deny embedding in iframes (clickjacking)
  { key: "X-Frame-Options",                   value: "DENY" },
  // Enable XSS filter in older browsers
  { key: "X-XSS-Protection",                  value: "1; mode=block" },
  // Control referrer info sent on navigation
  { key: "Referrer-Policy",                   value: "strict-origin-when-cross-origin" },
  // Restrict browser feature APIs not needed here
  { key: "Permissions-Policy",                value: "camera=(), microphone=(), geolocation=()" },
  // Enable DNS prefetching for sub-resources
  { key: "X-DNS-Prefetch-Control",            value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode:  true,
  poweredByHeader:  false,   // don't expose "X-Powered-By: Next.js"
  compress:         true,    // gzip/brotli on responses

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source:  "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
