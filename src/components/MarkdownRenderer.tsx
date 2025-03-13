'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism';
import mermaid from 'mermaid';
import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-tomorrow.css';
import { mdComponents, CodeBlockProps } from '@/components/MdCoder';

// 定义标题结构
export interface TableOfContents {
  id: string;
  level: number;
  text: string;
}

// 用于跟踪ID使用情况的Map
const idCountMap = new Map<string, number>();

// 辅助函数：移除 emoji 表情符号
const removeEmoji = (text: string): string => {
  // 使用更兼容的方式检测和移除 emoji
  return text
    // 移除常见的 emoji 表情
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
    // 移除其他特殊符号
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|[\u2011-\u26FF]|[\u2300-\u23FF]|[\u2B05-\u2B07]|[\u2934-\u2935]|[\u2B1B-\u2B1C]|[\u3030]|[\u303D]|[\u2192-\u2199]|[\u2B00-\u2B99]|[\u2600-\u26FF]/g, '')
    // 移除变体选择器
    .replace(/[\uFE00-\uFE0F]/g, '')
    // 移除 ZWJ 序列
    .replace(/\u200D/g, '');
};

// 辅助函数：移除数学公式
const removeMathFormula = (text: string): string => {
  // 移除行内公式 $...$
  text = text.replace(/\$([^$]+)\$/g, '');
  // 移除块级公式 $$...$$
  text = text.replace(/\$\$([^$]+)\$\$/g, '');
  return text;
};

// 辅助函数：生成有效的 ID
const generateValidId = (text: string): string => {
  // 处理空文本的情况
  if (!text || !text.trim()) {
    return 'section-' + (Math.random() * 1000).toFixed(0);
  }

  // 预处理文本
  const processedText = text
    .trim()
    // 移除 emoji
    .pipe(removeEmoji)
    // 移除数学公式
    .pipe(removeMathFormula);

  // 生成基础ID
  let baseId = processedText
    // 将中文字符转换为拼音或保留原样
    .replace(/[\u4e00-\u9fa5]+/g, (match) => encodeURIComponent(match))
    // 将空格和其他特殊字符替换为连字符
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-')
    // 转换为小写
    .toLowerCase()
    // 移除开头和结尾的连字符
    .replace(/^-+|-+$/g, '')
    // 如果以数字开头，添加前缀
    .replace(/^([0-9])/, 'section-$1');

  // 确保baseId不为空
  if (!baseId) {
    baseId = 'section';
  }

  // 获取当前ID的计数
  const count = idCountMap.get(baseId) || 0;

  // 生成最终ID，不再添加额外的连字符
  const finalId = count === 0 ? baseId : `${baseId}${count}`;

  // 更新计数
  idCountMap.set(baseId, count + 1);

  // 打印生成的ID信息用于调试
  // console.log('Generated ID:', { text, baseId, finalId });

  return finalId;
};

// 为了支持 pipe 操作，扩展 String 原型
declare global {
  interface String {
    pipe(fn: (str: string) => string): string;
  }
}

String.prototype.pipe = function (fn) {
  return fn(this.toString());
};

export function MarkdownRenderer({ content, onTocChange }: {
  content: string;
  onTocChange?: (toc: TableOfContents[]) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef<string>('');
  const headingsRef = useRef<TableOfContents[]>([]);
  const headingIdsRef = useRef<Map<string, string>>(new Map());

  // 解析标题并生成目录
  const extractHeadings = useCallback((content: string) => {
    // 如果内容没有变化，直接返回缓存的结果
    if (processedRef.current === content) {
      return headingsRef.current;
    }

    // 更新处理的内容标记
    processedRef.current = content;

    // 重置ID映射
    headingIdsRef.current.clear();
    idCountMap.clear();

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TableOfContents[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      // 确保text不为空
      if (text) {
        const id = generateValidId(text);
        // 存储标题文本和ID的映射关系
        headingIdsRef.current.set(text, id);
        headings.push({ level, text, id });
      }
    }

    // 缓存结果
    headingsRef.current = headings;

    // 只在内容真正变化时才触发回调
    onTocChange?.(headings);

    return headings;
  }, [onTocChange]);

  // 获取标题ID的函数
  const getHeadingId = useCallback((text: string) => {
    const trimmedText = text.trim();
    // 如果已经有生成过的ID，直接使用
    if (headingIdsRef.current.has(trimmedText)) {
      return headingIdsRef.current.get(trimmedText);
    }
    // 如果没有，生成新的ID（这种情况不应该发生，但作为后备处理）
    console.warn('Unexpected heading text not found in cache:', trimmedText);
    return generateValidId(trimmedText);
  }, []);

  useEffect(() => {
    extractHeadings(content);
  }, [content, extractHeadings]);

  useEffect(() => {
    mermaid.initialize({
      theme: 'neutral',
      fontFamily: 'JetBrains Mono',
      themeVariables: {
        fontFamily: 'JetBrains Mono',
      },
      securityLevel: 'loose'
    });
    setIsMounted(true);
  }, []);

  // 处理 mermaid 图表渲染
  useEffect(() => {
    if (isMounted && mermaidRef.current) {
      mermaid.init(undefined, '.mermaid');
    }
  }, [isMounted, content]);

  const components: Partial<Components> = {
    // 不要直接展开 mdComponents，而是有选择地使用其中的组件
    // ...mdComponents,

    // 自定义代码处理逻辑
    code: (props: CodeBlockProps & {
      node?: {
        tagName?: string;
        position?: {
          start: { line: number };
          end: { line: number }
        }
      }
    }) => {
      // 通过检查 node 属性来确定是否为行内代码
      const isInlineCode = props.inline === true ||
        (props.node && props.node.tagName === 'code' &&
          props.node.position &&
          props.node.position.start.line === props.node.position.end.line);

      // 如果是行内代码，直接返回简单的 code 标签
      if (isInlineCode) {
        return (
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-jetbrains">
            {props.children}
          </code>
        );
      }

      // 如果是 mermaid 代码块
      const match = /language-(\w+)/.exec(props.className || '');
      const lang = match ? match[1] : '';

      if (lang === 'mermaid') {
        return (
          <div className="my-8">
            <div
              ref={mermaidRef}
              className="mermaid bg-card dark:bg-card rounded-lg p-6"
            >
              {String(props.children || '').replace(/\n$/, '')}
            </div>
          </div>
        );
      }

      // 对于其他代码块，使用 MdCoder 中的 CodeBlock 组件
      return mdComponents.code?.({
        ...props,
        children: props.children || ''
      });
    },

    // 标题组件处理，添加原始文本保存
    h1: ({ children }) => {
      const text = String(children).trim();
      const id = getHeadingId(text);
      return <h1 id={id}>{children}</h1>;
    },
    h2: ({ children }) => {
      const text = String(children).trim();
      const id = getHeadingId(text);
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({ children }) => {
      const text = String(children).trim();
      const id = getHeadingId(text);
      return <h3 id={id}>{children}</h3>;
    },
  };

  // 如果还没有挂载，显示加载状态
  if (!isMounted) {
    return (
      <div className="prose prose-lg dark:prose-invert max-w-none animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypePrism]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}