/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/wishlist', destination: '/account/wishlist', permanent: false },
      { source: '/shipping', destination: '/delivery-return', permanent: true },
      { source: '/returns', destination: '/delivery-return', permanent: true },
      { source: '/delivery', destination: '/delivery-return', permanent: true },
      { source: '/warranty', destination: '/terms', permanent: true },
    ];
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return [
      {
        source: '/backend-api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
