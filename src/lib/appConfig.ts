export const appConfig = {
  // 基础配置
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',

  // GitHub 配置
  github: {
    owner: process.env.GITHUB_OWNER || '',
    repo: process.env.GITHUB_REPO || '',
    token: process.env.GITHUB_TOKEN || '',
  },

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
  auth: {
    oAuthProviders: ["google", "github"],
  },

  // API 路径配置
  api: {
    articles: '/api/articles',
    category: '/api/getCategory',
    src: '/api/getSrc',
    login: '/api/login',
    logout: '/api/logout',
    checkAuth: '/api/check-auth',
  },

  // 内容路径配置
  content: {
    articles: 'data/json/articles.json',
    mdFolder: 'data/md',
    toolsFolder: 'data/json',
  },
  
  // 界面配置
  ui: {
    // 是否显示工具卡片的banner图
    showToolBanner: process.env.NEXT_PUBLIC_SHOW_TOOL_BANNER !== 'false',
  },
};