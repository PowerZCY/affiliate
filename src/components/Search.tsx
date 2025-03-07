'use client';

import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    DotsHorizontalIcon,
    GlobeIcon,
    LightningBoltIcon
} from "@radix-ui/react-icons";
import { useState } from 'react';

import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

export function Search({ className }: { className?: string }) {
    const [search, setSearch] = useState('');
    const t = useTranslations('search');

    const handleSearch = () => {
        if (search.trim()) {
            window.location.href = `/tools/${encodeURIComponent(search.trim())}`;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <Command
                className={cn("rounded-lg border shadow-md", className)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.defaultPrevented) {
                        handleSearch();
                    }
                }}
            >
                <CommandInput
                    placeholder={t('input_placeholder')}
                    value={search}
                    onValueChange={setSearch}
                />
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
    )
}
