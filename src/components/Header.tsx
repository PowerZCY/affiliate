'use client'
import React, { useState } from 'react'
import { Link } from '@/lib/i18n'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, X, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeModeButton } from '@/components/ThemeModeButton'
import { LocaleButton } from '@/components/LocaleButton'
import { NavigationMenu } from '@/components/NavigationMenu'
import { appConfig, getValidLocale } from '@/lib/appConfig'
import Image from "next/image"
import IconImage from "../../public/favicon.svg"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const currentLocale = useLocale();
  // 使用 appConfig 中的辅助函数获取有效的语言设置
  const locale = getValidLocale(currentLocale);
  const t1 = useTranslations('menu')
  const size = 30;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo 和网站名称 */}
        <div className="mr-4 flex">
          <Link 
            href="/" 
            locale={locale} 
            className="mr-6 flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src={IconImage}
              width={size}
              height={size}
              alt="AI·Affiliate"
              className="cursor-pointer"
            />
            <span className="font-bold text-xl cursor-pointer">AI·Affiliate</span>
          </Link>
        </div>

        {/* 桌面导航菜单 - 只在大屏幕上显示 */}
        <div className="hidden md:flex md:flex-1">
          <NavigationMenu 
            items={appConfig.menu} 
            locale={locale} 
          />
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

          {/* 移动端菜单按钮 */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? t1('closeMenu') : t1('openMenu')}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4">
            <NavigationMenu 
              items={appConfig.menu} 
              locale={locale} 
              mobile={true}
              onItemClick={closeMenu}
            />
            
            {/* 移动端按钮组 */}
            <div className="mt-4 flex items-center divide-x divide-border border-t pt-4">
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
      )}
    </header>
  )
}