'use client'
import React from 'react'; // 确保导入 React
import { useState, useEffect } from 'react'
import { Link, usePathname } from "@/lib/i18n";
import { Github, MenuIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import IconImage from "../../public/favicon.svg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ThemeModeButton } from "@/components/ThemeModeButton";
import { LocaleButton } from "@/components/LocaleButton";
import { useTranslations } from 'next-intl';
type categoriesType = {
  name: string,
  src: string,
  description: string,
  link: string
}

type navigationProp = {
  categories: categoriesType[]
}


export const Navigation = ({ categories }: navigationProp) => {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('navigation');

  const menuItems: {
    label: string;
    href: string;
  }[] = [
      {
        label: t('homeBtn'),
        href: "/",
      },
      {
        label: t('categoryBtn'),
        href: "/category",
      },
      {
        label: t('articleBtn'),
        href: "/article",
      },
      {
        label: t('changelogBtn'),
        href: "/changelog",
      },
    ];
  const isMenuItemActive = (href: string) => {
    // console.log(pathname, href);
    return pathname === href;
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);


  const size = 30;
  /* 
  让NavigationMenuLink能访问 DOM 节点进行焦点管理，即用户能用通过键盘操作菜单，示例
  首页 [Tab键] -> 分类 [Tab键] -> 文章 [Tab键] -> 更新日志
    展开子菜单时
    分类 [Enter键] -> 
      - 开发工具 [方向键下]
      - 设计资源 [方向键下]
      - 学习资料
  */
  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  })
  // 仅仅是为了方便调试
  ListItem.displayName = "ListItem"
  /* 
  React组件控制显隐的模式
  1.通过 className 控制：
  - hidden/block
  - invisible/visible
  - opacity-0/opacity-100
  2.通过状态控制：
  - open={boolean}
  - visible={boolean}
  - show={boolean}
  3.通过条件渲染：
  - {condition && <Component/>}
  - {condition ? <Show/> : <Hide/>}
  */
  return (

    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          {/* 显示Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={IconImage}
              className="block"
              width={size}
              height={size}
              alt="DomainScore"
            />
            <span className="inline-block font-bold text-xl">AI·Affiliate</span>
          </Link>
          {/* 导航菜单，默认隐藏，屏幕大的就显示，即非移动端展示 */}
          <nav className="hidden md:flex gap-6">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        '/' === pathname && "bg-accent text-accent-foreground font-bold"
                      )}
                    >
                      {t('homeBtn')}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn('font-medium', '/category' === pathname && "font-extrabold")}>{t('categoryBtn')}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 lg:w-[600px] ">
                      {categories.map((category) => (
                        <ListItem
                          key={category.name}
                          title={category.name}
                          href={`/category/${category.link}`}
                          className='capitalize'
                        >
                          {category.description}
                        </ListItem>
                      ))}
                      <ListItem
                        title={t('moreCategoryBtn')}
                        href={'/category'}
                        className='capitalize border border-muted  bg-gradient-to-b  from-muted/50 to-muted/20'
                      >
                        {t('moreCategoryDescription')}
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn('font-medium', '/article' === pathname && "font-extrabold")}>
                    {t('articleBtn')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              AI·Affilicate
                            </div>
                            <p className="text-xs leading-tight text-muted-foreground">
                              {t('articleDescription')}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/article/add-new-developer-tools" title="Add Tools">
                        {t('article1Title')}
                      </ListItem>
                      <ListItem href="/article/deploy-own-ai-affilicate" title="Deploy AI Affilicate">
                        {t('article2Title')}
                      </ListItem>
                      <ListItem href="/article" title={t('moreArticleBtn')} className='border border-muted  bg-gradient-to-b  from-muted/50 to-muted/20'>
                        {t('moreArticleDescription')}
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/changelog" className={cn(navigationMenuTriggerStyle(), 'font-medium', '/changelog' === pathname && "font-extrabold")}>
                      {t('changelogBtn')}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {/* 桌面端才有, 提交工具按钮 */}
          <Link href="/article/add-new-developer-tools" className='hidden md:block'>
            <Button
              variant="default"
              className='text-sm font-medium rounded-full px-4 py-2 h-9'
            >
              {t('submitToolBtn')}
            </Button>
          </Link>
          {/* 主题、语言按钮，全端都有 */}
          <div className="flex items-center gap-2">
            <ThemeModeButton />
            <LocaleButton />
          </div>
          {/* Github链接，全端 */}
          <Link
            href={"https://github.com/PowerZCY/affiliate"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          {/* Sheet页，通过open开关，指定了只有移动端才有，这里才是移动端的导航菜单 */}
          <Sheet
            open={mobileMenuOpen}
            onOpenChange={(open) => setMobileMenuOpen(open)}
          >
            <SheetTrigger asChild>
              <Button
                className="md:hidden"
                size="icon"
                variant="outline"
                aria-label="Menu"
              >
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[250px]" side="right">
              <div className="flex flex-col items-start justify-center">
                {menuItems.map((menuItem) => (
                  <Link
                    key={menuItem.href}
                    href={menuItem.href}
                    className={cn(
                      "block px-3 py-2 text-lg",
                      isMenuItemActive(menuItem.href) ? "font-bold" : "",
                    )}
                  >
                    {menuItem.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}