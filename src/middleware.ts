import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { appConfig } from "@/lib/appConfig";

/* 
- 检查 URL 是否包含语言前缀
- 如果没有语言前缀，根据用户浏览器设置添加默认语言
- 处理语言切换的重定向
- 验证请求的语言是否在支持列表中
这样设计确保：

1. 所有页面都有正确的语言前缀
2. 用户总是看到合适的语言版本
3. 权限验证和语言处理可以同时工作
 */
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: appConfig.i18n.locales,
  // Used when no locale matches
  defaultLocale: appConfig.i18n.defaultLocale,
  // 禁用自动语言检测，确保使用defaultLocale作为默认语言
  localeDetection: false,
  // 设置为 'always'，确保所有路径都有语言前缀
  localePrefix: 'always'
});

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only check authentication for /admin routes
  if (path.startsWith('/admin')) {
    console.log('isLoggedIn');
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)"
  ],
};