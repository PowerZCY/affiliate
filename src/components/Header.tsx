'use client'
import { LocaleButton } from "@/components/LocaleButton";
import { ThemeModeButton } from "@/components/ThemeModeButton";
import { Link } from "@/lib/i18n";
import { Github } from 'lucide-react';
import Image from "next/image";
import IconImage from "../../public/favicon.svg";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { getValidLocale } from "@/lib/appConfig";

// 菜单项类型定义
type MenuItem = {
  key: string;
  href: string;
  children?: MenuItem[];
};

export function Header() {
  const size = 30;
  const t = useTranslations('header');
  const currentLocale = useLocale();
  // 使用 appConfig 中的辅助函数获取有效的语言设置
  const locale = getValidLocale(currentLocale);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 菜单项配置 - 实际项目中可以从配置文件中导入
  const menuItems: MenuItem[] = [
    {
      key: 'ai-journey',
      href: '/ai-journey',
    },
    {
      key: 'documentation',
      href: '/docs',
    },
    // 可以在这里添加更多菜单项
  ];

  // 处理Logo点击事件，确保跳转到当前语言的首页
  const handleLogoClick = () => {
    setMobileMenuOpen(false); // 如果移动菜单打开，则关闭
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* 左侧 Logo 区域 */}
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center space-x-2"
            onClick={handleLogoClick}
            locale={locale}
          >
            <Image
              src={IconImage}
              className="block"
              width={size}
              height={size}
              alt="AI Affiliate Logo"
            />
            <span className="inline-block font-bold text-xl">AI·Affiliate</span>
          </Link>
        </div>

        {/* 中间导航菜单 - 桌面端显示 */}
        <nav className="hidden md:flex items-center space-x-6 mx-6">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              locale={locale}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              {t(item.key, { fallback: item.key })}
            </Link>
          ))}
        </nav>

        {/* 右侧工具栏 */}
        <div className="flex items-center gap-3">
          <ThemeModeButton />
          <LocaleButton />
          <Link
            href="https://github.com/PowerZCY/affiliate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          
          {/* 移动端菜单按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                locale={locale}
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(item.key, { fallback: item.key })}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}