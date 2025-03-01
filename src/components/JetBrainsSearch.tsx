'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DotsHorizontalIcon,
  GlobeIcon,
  LightningBoltIcon
} from "@radix-ui/react-icons"

export function JetBrainsSearch() {
  const [search, setSearch] = React.useState('')
  const t = useTranslations('search')

  const handleSearch = () => {
    if (search.trim()) {
      window.location.href = `/tools/${encodeURIComponent(search.trim())}`
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="relative flex w-full items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('input_placeholder')}
            className="pl-10 pr-20 h-12 rounded-full border-2 focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.defaultPrevented) {
                handleSearch()
              }
            }}
          />
        </div>
        <Button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 rounded-full"
        >
          {t('button')}
        </Button>
      </form>

      {/* 搜索建议下拉框 */}
      {search && (
        <div className="absolute w-full mt-1">
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              <CommandGroup heading={t('heading')}>
                <CommandItem onSelect={() => window.location.href = '/tools/ai'}>
                  <LightningBoltIcon className="mr-2 h-4 w-4" />
                  <span>AI</span>
                </CommandItem>
                <CommandItem onSelect={() => window.location.href = '/tools/seo'}>
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  <span>SEO</span>
                </CommandItem>
                <CommandItem disabled>
                  <DotsHorizontalIcon className="mr-2 h-4 w-4" />
                  <span>{t('more')}</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}