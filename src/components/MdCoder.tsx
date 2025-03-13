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

  return (
    <div className="code-block-wrapper group">
      <div className="code-block-header">
        <span className="code-block-language">
          {language}
        </span>
        <div className="code-block-toolbar">
          <button
            onClick={copyCode}
            className="code-block-copy-button"
            title="Copy"
            aria-label="Copy"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      <div className="code-block-content relative">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers
          wrapLines
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '1rem 0',
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
      </div>
    </div>
  );
};

export const mdComponents = {
  code: CodeBlock,
}; 