'use client'

import React from 'react'
import { Link } from "@/lib/i18n";
import { Github } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";
import IconImage from "../../public/favicon.svg";
import { appConfig, getValidLocale, MenuItem } from '@/lib/appConfig'

export function Footer() {
  const currentLocale = useLocale()
  const locale = getValidLocale(currentLocale)
  const t = useTranslations('footer');
  const t1 = useTranslations('menu');
  const t2 = useTranslations('home');
  const size = 30;

  // 获取一级菜单项（没有子菜单的项目）
  const topLevelMenuItems = appConfig.menu.filter(item => !item.children || item.children.length === 0)

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={IconImage}
                width={size}
                height={size}
                alt={t2('title')}
              />
              <span className="font-bold text-lg">{t2('title')}</span>
            </Link>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" locale={locale} className="text-sm hover:underline">
                  {t('home')}
                </Link>
              </li>
              {/* 添加配置的一级菜单项 */}
              {topLevelMenuItems.map((item: MenuItem) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    locale={locale}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="text-sm hover:underline"
                  >
                    {t1(item.key, { fallback: item.key })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('connect')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/PowerZCY/affiliate"
                  target="_blank"
                  className="text-sm hover:underline flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          Copyright &copy; {new Date().getFullYear()} {t2('title')} {t('copyright')}
        </div>
      </div>
    </footer>
  );
}