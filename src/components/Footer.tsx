// components/Footer.js
import { Link } from "@/lib/i18n";
import React from 'react'; // 确保导入 React
import Image from "next/image";
import IconImage from "../../public/favicon.svg";
import { useTranslations } from 'next-intl';
import { Github } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const size = 30;
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
                alt="AI·Affiliate"
              />
              <span className="font-bold text-lg">AI·Affiliate</span>
            </Link>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/category" className="text-sm hover:underline">
                  {t('category')}
                </Link>
              </li>
              <li>
                <Link href="/article" className="text-sm hover:underline">
                  {t('article')}
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-sm hover:underline">
                  {t('changelog')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:underline">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:underline">
                  {t('termsOfService')}
                </Link>
              </li>
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
          Copyright &copy; {new Date().getFullYear()} AI·Affiliate {t('copyright')}
        </div>
      </div>
    </footer>
  );
}