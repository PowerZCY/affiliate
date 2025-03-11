'use client'
import { LocaleButton } from "@/components/LocaleButton";
import { ThemeModeButton } from "@/components/ThemeModeButton";
import { Link } from "@/lib/i18n";
import { Github } from 'lucide-react';
import Image from "next/image";
import IconImage from "../../public/favicon.svg";

export function Header () {
  const size = 30;

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
        </div>
      </div>
    </header>
  )
}