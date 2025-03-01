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
import { usePathname, useRouter } from "@/lib/i18n";


import {
  LanguagesIcon
} from "lucide-react";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function LocaleButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();
  const [locale, setLocale] = useState<string>(currentLocale);
  const { locales, localeLabels } = appConfig.i18n;
  
  // 当currentLocale变化时更新本地状态
  useEffect(() => {
    setLocale(currentLocale);
  }, [currentLocale]);

  // 构建完整的URL，包含查询参数
  const getUrlWithParams = (path: string) => {
    const params = searchParams.toString();
    return params ? `${path}?${params}` : path;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <LanguagesIcon className="size-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="font-sans opacity-90">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            setLocale(value);
            // 使用next-intl的router进行导航
            router.replace(
              getUrlWithParams(pathname),
              { locale: value as "en" | "zh" }
            );
          }}
        >
          {locales.map((locale) => {
            return (
              <DropdownMenuRadioItem key={locale} value={locale}>
                {locale in localeLabels
                  ? localeLabels[locale]
                  : locale}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
