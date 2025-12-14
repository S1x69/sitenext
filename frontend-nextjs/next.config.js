/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'boca.com.br',
      },
      {
        protocol: 'https',
        hostname: 'images.boca.com.br',
      },
      {
        protocol: 'https',
        hostname: 'agenciadenoticias.ibge.gov.br',
      },
      {
        protocol: 'https',
        hostname: 'media-agro.estadao.com.br',
      },
      {
        protocol: 'https',
        hostname: '**.glbimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.estadao.com.br',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/post-sitemap:page(\\d+).xml',
        destination: '/api/post-sitemap?page=:page',
      },
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_BACKEND_URL + '/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
