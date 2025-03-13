'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Twitter, Linkedin } from 'lucide-react';
import { Separator } from '@/components/blog/separator';

export function BlogFooter() {
  return (
    <div className="border-t border-border/50 mt-8">
      <div className="container py-6">
        {/* 三列布局 */}
        <div className="flex items-center justify-between">
          {/* 左侧空白 */}
          <div className="w-1/3" />

          {/* 中间的分享按钮 */}
          <div className="w-1/3 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-muted/80"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-muted/80"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          </div>

          {/* 右侧的导航按钮 */}
          <div className="w-1/3 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              上一篇
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              下一篇
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 