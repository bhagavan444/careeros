import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import './IntelligenceDocument.css';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="code-block-container">
        <div className="code-block-header">
          <span className="code-block-language">{language}</span>
          <button className="code-block-copy-btn" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy code'}</span>
          </button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className={`inline-code ${className || ''}`} {...props}>
      {children}
    </code>
  );
};

export default function IntelligenceDocument({ content, isStreaming }) {
  const markdownText = useMemo(() => {
    if (!content) return "";
    
    let cleaned = content;
    if (cleaned.startsWith("{") || cleaned.startsWith("}")) {
      try {
        const json = JSON.parse(cleaned);
        let md = "";
        if (json.executive_summary) md += `### Executive Summary\n${json.executive_summary}\n\n`;
        if (json.key_findings && json.key_findings.length) md += `### Key Findings\n` + json.key_findings.map(item => `- ${item}`).join('\n') + `\n\n`;
        if (json.recommendations && json.recommendations.length) md += `### Recommendations\n` + json.recommendations.map(item => `- ${item}`).join('\n') + `\n\n`;
        return md.trim();
      } catch (e) {
        // Fallback
      }
    }
    return cleaned;
  }, [content]);

  return (
    <div className={`intelligence-markdown-body ${isStreaming ? 'streaming' : ''}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
          table: ({ node, ...props }) => (
            <div className="table-wrapper">
              <table {...props} />
            </div>
          )
        }}
      >
        {markdownText}
      </ReactMarkdown>
    </div>
  );
}
