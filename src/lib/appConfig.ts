export const appConfig = {
  // 基础配置
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',

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
    localeDetection: false,
    localeCurrencies: {
      /* This only works with Stripe for now. For LemonSqueezy, we need to set the currency in the LemonSqueezy dashboard and there can only be one. */
      en: "USD",
      de: "USD",
      es: "USD",
    },
  },
  
  // 界面配置
  ui: {
    // 是否显示工具卡片的banner图
    showToolBanner: process.env.NEXT_PUBLIC_SHOW_TOOL_BANNER !== 'false',
    // 每页显示的工具数量
    toolsPerPage: 12,
  },

  // 菜单配置
  menu: [
    {
      key: 'journey',
      href: '/journey',
    },
    {
      key: 'docs',
      href: '/docs',
      children: [
        {
          key: 'gettingStarted',
          href: '/docs/getting-started',
        },
        {
          key: 'guides',
          href: '/docs/guides',
        },
        {
          key: 'apiReference',
          href: '/docs/api',
        },
      ],
    }
  ] as MenuItem[]
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

// 菜单项类型定义
export type MenuItem = {
  key: string;        // 唯一标识，也用作国际化翻译键
  href: string;       // 链接地址
  children?: MenuItem[]; // 子菜单项
  external?: boolean; // 是否为外部链接
};