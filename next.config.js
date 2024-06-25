/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    secret: 'e5836583-e581-4d4f-9c57-76a3e5185624', // secret used for jwt generation
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'profilepictures-opentap.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
    
}

module.exports = nextConfig
