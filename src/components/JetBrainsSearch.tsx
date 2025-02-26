'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function JetBrainsSearch() {
  const t = useTranslations('search')
  const [query, setQuery] = React.useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 处理搜索逻辑
  }
  
  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex w-full max-w-2xl items-center"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('input_placeholder')}
          className="pl-10 pr-20 h-12 rounded-full border-2 focus-visible:ring-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button 
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 rounded-full"
      >
        {t('button')}
      </Button>
    </form>
  )
} 