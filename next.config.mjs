import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'favicon.im',
      },
      {
        protocol: 'https',
        hostname: 'domainscore.ai',
      },
      {
        protocol: 'https',
        hostname: 'llmgpuhelper.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  optimizeFonts: true,
  // 优化 bundle 大小
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        '.pnpm-store/**/*',
        'node_modules/.pnpm/**/*',
        '.git/**/*',
        'public/images/banner/**/*',
        '.next/trace/**/*'
      ]
    }
  }
};

export default withNextIntl(nextConfig);
