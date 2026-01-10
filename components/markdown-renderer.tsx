'use client'

import { useState } from 'react'
import { Eye, EyeOff, Code } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Button } from './ui/button'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [showRaw, setShowRaw] = useState(false)

  return (
    <div className={`markdown-renderer relative group ${className}`}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRaw(!showRaw)}
          className="h-7 px-2 text-xs"
        >
          {showRaw ? (
            <>
              <Eye className="w-3 h-3 mr-1" />
              Rendered
            </>
          ) : (
            <>
              <Code className="w-3 h-3 mr-1" />
              Raw
            </>
          )}
        </Button>
      </div>

      {showRaw ? (
        <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-xs whitespace-pre max-w-full overflow-x-auto">
          {content}
        </pre>
      ) : (
        <div className="prose prose-xs max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              p: ({ node, ...props }) => <p {...props} className="text-xs mb-2" />,
              h1: ({ node, ...props }) => <h1 {...props} className="text-sm font-bold mb-2" />,
              h2: ({ node, ...props }) => <h2 {...props} className="text-sm font-bold mb-2" />,
              h3: ({ node, ...props }) => <h3 {...props} className="text-sm font-bold mb-2" />,
              h4: ({ node, ...props }) => <h4 {...props} className="text-sm font-bold mb-2" />,
              h5: ({ node, ...props }) => <h5 {...props} className="text-sm font-bold mb-2" />,
              h6: ({ node, ...props }) => <h6 {...props} className="text-sm font-bold mb-2" />,
              ul: ({ node, ...props }) => <ul {...props} className="text-xs space-y-1 mb-2" />,
              ol: ({ node, ...props }) => <ol {...props} className="text-xs space-y-1 mb-2" />,
              li: ({ node, ...props }) => <li {...props} className="text-xs" />,
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-xs overflow-x-auto max-w-full whitespace-pre my-2"
                />
              ),
              code: ({ node, ...props }: any) =>
                props.inline ? (
                  <code {...props} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs" />
                ) : (
                  <code {...props} className="text-xs" />
                ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
