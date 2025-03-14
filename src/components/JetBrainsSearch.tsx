'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DotsHorizontalIcon,
  GlobeIcon,
  LightningBoltIcon
} from "@radix-ui/react-icons"

export function JetBrainsSearch({
  onSearch,
  initialKeyword = ''
}: {
  onSearch?: (keyword: string) => void,
  initialKeyword?: string
}) {
  const [search, setSearch] = React.useState(initialKeyword)
  const [isSearching] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const t = useTranslations('search')

  // 当initialKeyword变化时更新search状态
  React.useEffect(() => {
    setSearch(initialKeyword);
  }, [initialKeyword]);

  const handleSearch = async () => {
    if (search.trim()) {
      if (onSearch) {
        // 如果提供了onSearch回调，则在首页直接显示结果
        onSearch(search.trim());
      } else {
        // 否则保持原有行为，跳转到搜索页面
        window.location.href = `/tools/${encodeURIComponent(search.trim())}`
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  // 处理建议选项选择
  const handleSuggestionSelect = (suggestion: string) => {
    setSearch(suggestion);
    // 设置搜索词后立即触发搜索
    setTimeout(() => {
      if (onSearch) {
        onSearch(suggestion);
      } else {
        window.location.href = `/tools/${encodeURIComponent(suggestion)}`;
      }
    }, 0);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto"> {/* 增加最大宽度并居中 */}
      <form
        onSubmit={handleSubmit}
        className="relative flex w-full items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('inputPlaceholder')}
            className="pl-10 pr-28 h-12 rounded-full border-2 focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={(_e) => {
              setTimeout(() => setIsFocused(false), 200);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.defaultPrevented) {
                handleSearch()
              }
            }}
          />
        </div>
        <Button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-10 w-24 rounded-full flex items-center justify-center"
          disabled={isSearching}
        >
          {isSearching ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
          ) : (
            t('button')
          )}
        </Button>
      </form>

      {/* 搜索建议下拉框也需要适配新的宽度 */}
      {isFocused && !isSearching && (
        <div className="absolute w-full mt-1">
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              <CommandGroup heading={t('heading')}>
                <CommandItem onSelect={() => handleSuggestionSelect('AI')}>
                  <LightningBoltIcon className="mr-2 h-4 w-4" />
                  <span>AI</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSuggestionSelect('SEO')}>
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