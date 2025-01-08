const { withContentlayer } = require('next-contentlayer2');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  frame-src 'self' https://www.youtube.com https://youtu.be/ https://www.youtube.com/embed/ giscus.app https://codesandbox.io/;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://i.ytimg.com https://cdn.sanity.io data: blob:;
  media-src *.s3.amazonaws.com;
  connect-src 'self' https://api.sanity.io https://api.sanity.io https://p7zahyd4.api.sanity.io ${process.env.ADDITIONAL_CONNECT_SRC || ''};
  font-src 'self';
`.replace(/\n/g, ' ');

// Security Headers
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
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
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

// Configuration Next.js
const output = process.env.EXPORT ? 'export' : undefined;
const basePath = process.env.BASE_PATH || undefined;
const unoptimized = !!process.env.UNOPTIMIZED;

/**
 * @type {import('next').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer];

  return plugins.reduce(
    (acc, next) => next(acc),
    {
      output,
      basePath,
      reactStrictMode: true,
      pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
      eslint: {
        dirs: ['app', 'components', 'layouts', 'scripts'],
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'picsum.photos',
          },
          {
            protocol: 'https',
            hostname: 'cdn.sanity.io',
          },
        ],
        unoptimized,
      },
      async headers() {
        return [
          {
            source: '/(.*)', // Applique les en-têtes à toutes les routes
            headers: securityHeaders,
          },
        ];
      },
      webpack: (config, options) => {
        config.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        });

        return config;
      },
    }
  );
};
