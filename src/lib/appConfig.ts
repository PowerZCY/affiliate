// 菜单项类型定义
export type MenuItem = {
  key: string;        // 唯一标识，也用作国际化翻译键
  href: string;       // 链接地址
  children?: MenuItem[]; // 子菜单项
  external?: boolean; // 是否为外部链接
};

// 开发环境菜单配置
const devMenu: MenuItem[] = [
  {
    key: 'journey',
    href: '/blog',
  },
  // {
  //   key: 'docs',
  //   href: '/docs',
  //   children: [
  //     {
  //       key: 'gettingStarted',
  //       href: '/docs/getting-started',
  //     },
  //     {
  //       key: 'guides',
  //       href: '/docs/guides',
  //     },
  //     {
  //       key: 'apiReference',
  //       href: '/docs/api',
  //     },
  //   ],
  // }
];

// 生产环境菜单配置
const prodMenu: MenuItem[] = [
  // {
  //   key: 'journey',
  //   href: '/blog',
  // }
];

export const appConfig = {
  // 基础配置
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://aidirectorylist.com',

  // 国际化配置
  i18n: {
    // locales: ["en", "de", "es"] as const,
    locales: ["en", "zh"] as const,
    defaultLocale: "en" as const,
    localeLabels: {
      en: "English",
      zh: "简体中文",
      // es: "Español",
      // de: "Deutsch",
      // fr: "asdf",
    },
    detector: {
      storageKey: 'language-preference-status',
      autoCloseTimeout: 10000,
      expirationDays: 30,
      storagePrefix: 'AI-Affiliate'
    },
    messageRoot: 'messages',
    localeCurrencies: {
      /* This only works with Stripe for now. For LemonSqueezy, we need to set the currency in the LemonSqueezy dashboard and there can only be one. */
      en: "USD",
      de: "USD",
      es: "USD",
    },
  },
  // 博客配置
  blog: {
    // 博客相关路径
    dir: 'public/md',
    config: 'public/md/blog-config.json',
    // 标签定义: 决定了翻译文件字段
    tags: [
      'makeMoney',
      'roadOverSea',
      'productUpdates',
      'insights',
      'tutorials'
    ],
    // 图片资源路径
    images: {
      default: '/images/default.webp',
      defaultAvatar: '/images/avatars/default.webp'
    },
    getTagDisplayCount: (_locale: string) => {
      return 2;
    },
    pageConfig: {
      size: 2
    }
  },
  tool: {
    bannerDir: '/images/banner',
    defaultBanner: '/images/default.webp'
  },
  // 界面配置
  ui: {
    // 是否显示工具卡片的banner图
    showToolBanner: process.env.NEXT_PUBLIC_SHOW_TOOL_BANNER !== 'false',
    // 是否显示工具卡片的统计信息
    showStatistics: process.env.NEXT_PUBLIC_SHOW_STATISTICS !== 'false',
  },

  // 分类配置数据
  metaConfig: {
    category: {
      dirName: 'data',
      secondDirName: 'json',
      // 开发环境和生产环境数据隔离
      thirdDirName: process.env.NODE_ENV === 'production' ? 'online' : 'dev',
      toolDirName: 'tools',
      coreName: 'category.jsonc'
    }
  },

  // 菜单配置
  menu: process.env.NODE_ENV !== 'production' ? devMenu : prodMenu,
};

// 辅助函数：检查是否为支持的语言
function isSupportedLocale(locale: string): locale is typeof appConfig.i18n.locales[number] {
  return (appConfig.i18n.locales as readonly string[]).includes(locale);
}

// 辅助函数：获取有效的语言设置
// 如果当前语言不支持，则返回默认语言
export function getValidLocale(locale: string): typeof appConfig.i18n.locales[number] {
  return isSupportedLocale(locale) ? locale : appConfig.i18n.defaultLocale;
}