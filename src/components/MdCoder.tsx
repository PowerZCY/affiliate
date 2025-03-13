import { Copy, Check } from 'lucide-react';
import { useState, ReactNode } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
  inline?: boolean;
  style?: React.CSSProperties;
}

// 代码块组件
const CodeBlock = ({ children = '', className, style }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'plaintext';
  const codeString = String(children).replace(/\n$/, '');

  const copyCode = async (): Promise<void> => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 修改返回结构，使用 pre 作为最外层元素，避免在 p 标签内嵌套 div
  return (
    <pre className="relative my-4 rounded-lg overflow-hidden">
      {/* 语言标签和复制按钮 */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        <span className="text-xs font-medium bg-muted/80 px-2 py-1 rounded">
          {language}
        </span>
        <button
          onClick={copyCode}
          className="p-1 rounded bg-muted/80 hover:bg-muted transition-colors"
          title="复制代码"
          aria-label="复制代码"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      {/* 代码高亮 */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers
        wrapLines
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '2rem 0 1rem',
          ...style
        }}
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: '#606366',
          textAlign: 'right',
        }}
        codeTagProps={{
          className: 'font-jetbrains text-sm',
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </pre>
  );
};

export const mdComponents = {
  code: CodeBlock,
};