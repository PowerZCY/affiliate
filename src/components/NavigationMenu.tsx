'use client'

import React from 'react'
import { Link } from '@/lib/i18n'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { MenuItem, appConfig, getValidLocale } from '@/lib/appConfig'
import { cn } from '@/lib/utils'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavigationMenuProps {
  items: MenuItem[]
  locale: string
  className?: string
  mobile?: boolean
  onItemClick?: () => void
}

export function NavigationMenu({ 
  items, 
  locale, 
  className,
  mobile = false,
  onItemClick
}: NavigationMenuProps) {
  const t1 = useTranslations('menu')
  // 确保 locale 是有效的类型
  const validLocale = getValidLocale(locale)

  // 渲染单个菜单项
  const renderMenuItem = (item: MenuItem) => {
    // 如果有子菜单，渲染下拉菜单
    if (item.children && item.children.length > 0) {
      if (mobile) {
        // 移动端使用可折叠菜单
        return (
          <MobileSubmenu 
            key={item.key} 
            item={item} 
            locale={validLocale} 
            t={t1} 
            onItemClick={onItemClick}
          />
        )
      } else {
        // 桌面端使用下拉菜单
        return (
          <DropdownMenu key={item.key}>
            <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium focus:outline-none">
              {t1(item.key)}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {item.children.map((child) => (
                <DropdownMenuItem key={child.key} asChild>
                  <Link
                    href={child.href}
                    locale={validLocale}
                    target={child.external ? '_blank' : undefined}
                    rel={child.external ? 'noopener noreferrer' : undefined}
                    onClick={onItemClick}
                    className="cursor-pointer"
                  >
                    {t1(child.key)}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }

    // 如果没有子菜单，渲染普通链接
    return (
      <Link
        key={item.key}
        href={item.href}
        locale={validLocale}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        onClick={onItemClick}
        className={cn(
          "text-muted-foreground hover:text-foreground transition-colors text-sm font-medium",
          mobile && "block py-2"
        )}
      >
        {t1(item.key)}
      </Link>
    )
  }

  return (
    <nav className={cn(
      mobile ? "space-y-3" : "flex items-center space-x-6",
      className
    )}>
      {items.map(renderMenuItem)}
    </nav>
  )
}

// 定义翻译函数的类型
type TranslationFunction = (key: string, options?: { fallback?: string }) => string;

// 移动端子菜单组件
function MobileSubmenu({ 
  item, 
  locale, 
  t, 
  onItemClick 
}: { 
  item: MenuItem, 
  locale: typeof appConfig.i18n.locales[number], 
  t: TranslationFunction,
  onItemClick?: () => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div key={item.key} className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
      >
        {t(item.key)}
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>
      
      {isOpen && (
        <div className="pl-4 space-y-2 border-l">
          {item.children?.map((child) => (
            <Link
              key={child.key}
              href={child.href}
              locale={locale}
              target={child.external ? '_blank' : undefined}
              rel={child.external ? 'noopener noreferrer' : undefined}
              onClick={onItemClick}
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {t(child.key)}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 