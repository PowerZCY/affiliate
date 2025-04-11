'use client'
import { LocaleButton } from '@/components/LocaleButton'
import { ThemeModeButton } from '@/components/ThemeModeButton'
import { getValidLocale } from '@/lib/appConfig'
import { Link } from '@/lib/i18n'
import { Github } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from "next/image"
import IconImage from "../../public/favicon.svg"

export function Header() {
  const currentLocale = useLocale();
  // 使用 appConfig 中的辅助函数获取有效的语言设置
  const locale = getValidLocale(currentLocale);
  const t = useTranslations('home')
  const size = 30;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo 和网站名称 */}
        <div className="mr-4 flex">
          <Link
            href="/"
            locale={locale}
            replace={true}
            className="mr-6 flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src={IconImage}
              width={size}
              height={size}
              alt={t('title')}
              className="cursor-pointer"
            />
            <span className="font-bold text-xl cursor-pointer">{t('title')}</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end">
          {/* 桌面端按钮组 */}
          <div className="hidden md:flex items-center divide-x divide-border">
            <div className="px-2">
              <LocaleButton />
            </div>
            <div className="px-2">
              <ThemeModeButton />
            </div>
            <div className="pl-2">
              <Link
                href="https://github.com/PowerZCY/affiliate"
                target="_blank"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}