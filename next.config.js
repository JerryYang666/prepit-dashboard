/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bucket-57h03x.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/prepit_data/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
