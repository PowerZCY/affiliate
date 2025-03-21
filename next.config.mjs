import createNextIntlPlugin from 'next-intl/plugin';
import { StatsWriterPlugin } from 'webpack-stats-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 允许加载图片的host
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
    // 允许加载svg图片
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  optimizeFonts: true,

  webpack: (config, { isServer, dev }) => {
    // 只在非生产构建时生成统计文件
    if (dev || isServer) {
      config.plugins.push(
        new StatsWriterPlugin({
          filename: './stats.json',
          stats: {
            assets: true,
            chunks: true,
            modules: true
          }
        })
      );

      // 分析模式：生成静态报告并输出总结
      if (process.env.ANALYZE === 'true') {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './.next/analyze/report.html',
            generateStatsFile: true,
            statsFilename: './.next/analyze/stats.json',
            reportTitle: 'Bundle Size Analysis',
            defaultSizes: 'parsed',
            openAnalyzer: false,
            analyzerHost: '127.0.0.1',
            logLevel: 'info'
          })
        );
      }
    }
    return config;
  }
};

// 组合配置增强器
const config = withNextIntl(nextConfig);
export default config;