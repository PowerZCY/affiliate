"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appConfig } from "@/lib/appConfig";
import { usePathname } from "@/lib/i18n";
import { LanguagesIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";

export function LocaleButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();
  const [locale, setLocale] = useState<string>(currentLocale);
  const { locales, localeLabels } = appConfig.i18n;
  const isChangingLocale = useRef(false);
  
  useEffect(() => {
    setLocale(currentLocale);
  }, [currentLocale]);

  // 获取干净的路径（移除语言前缀）
  const getCleanPath = useCallback((path: string) => {
    // 移除开头的语言前缀（如 /en/ 或 /zh/）
    const cleanPath = path.replace(/^\/[a-z]{2}(?=\/|$)/, '');
    return cleanPath || '/';
  }, []);

  // 构建目标URL
  const buildTargetUrl = useCallback((newLocale: string, path: string) => {
    if (typeof window === 'undefined') return '';

    const baseUrl = window.location.origin;
    const cleanPath = getCleanPath(path);
    
    // 构建新的查询参数（移除 _rsc 等参数）
    const params = new URLSearchParams(searchParams.toString());
    params.delete('_rsc');
    const cleanParams = params.toString();

    // 构建完整URL
    const localePath = `/${newLocale}${cleanPath === '/' ? '' : cleanPath}`;
    const fullPath = cleanParams ? `${localePath}?${cleanParams}` : localePath;
    
    return `${baseUrl}${fullPath}`;
  }, [searchParams, getCleanPath]);

  const handleLocaleChange = useCallback(async (newLocale: string) => {
    if (isChangingLocale.current || newLocale === currentLocale) {
      console.log('[Locale] Skip locale change - already in progress or same locale');
      return;
    }

    try {
      isChangingLocale.current = true;
      console.log(`[Locale] Changing locale from ${currentLocale} to ${newLocale}`);

      // 构建目标URL
      const targetUrl = buildTargetUrl(newLocale, pathname);
      console.log(`[Locale] Redirecting to: ${targetUrl}`);

      // 更新状态并执行重定向
      setLocale(newLocale);
      window.location.href = targetUrl;
    } catch (error) {
      console.error('[Locale] Error changing locale:', error);
      setLocale(currentLocale);
      isChangingLocale.current = false;
    }
  }, [currentLocale, pathname, buildTargetUrl]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          disabled={isChangingLocale.current}
        >
          <LanguagesIcon className="size-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="font-sans opacity-90">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={handleLocaleChange}
        >
          {locales.map((locale) => (
            <DropdownMenuRadioItem 
              key={locale} 
              value={locale}
              disabled={isChangingLocale.current}
            >
              {locale in localeLabels ? localeLabels[locale] : locale}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
