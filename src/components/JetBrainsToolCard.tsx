import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import styles from './JetBrainsToolCard.module.css';

export interface ToolCardProps {
  name: string;
  description: string;
  url: string;
  tags?: string[];
  icon_url?: string;
  category?: string;
}

export function JetBrainsToolCard({ 
  name, 
  description, 
  url, 
  tags = [], 
  icon_url,
  category 
}: ToolCardProps) {
  return (
    <div className="jetbrains-card group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {icon_url ? (
            <div className="h-10 w-10 overflow-hidden rounded-md">
              <Image
                src={icon_url}
                alt={name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            {tags && tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {category && (
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    {category}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">访问 {name}</span>
        </Link>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="jetbrains-button jetbrains-button-secondary text-sm px-3 py-1"
        >
          访问网站
        </Link>
      </div>
    </div>
  );
} 