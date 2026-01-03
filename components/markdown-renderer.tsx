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
        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-xs whitespace-pre max-w-full overflow-x-auto">
          {content}
        </pre>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-xs overflow-x-auto max-w-full whitespace-pre"
                />
              ),
              code: ({ node, ...props }: any) =>
                props.inline ? (
                  <code {...props} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs" />
                ) : (
                  <code {...props} />
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
