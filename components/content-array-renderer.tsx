'use client'

import { MarkdownRenderer } from './markdown-renderer'
import { ToolUseViewer, ThinkingViewer, ToolResultViewer } from './tool-viewer'
import { Zap } from 'lucide-react'

interface ContentArrayRendererProps {
  content: unknown[]
  className?: string
}

export function ContentArrayRenderer({ content, className = '' }: ContentArrayRendererProps) {
  if (!Array.isArray(content)) {
    return null
  }

  return (
    <div className={`content-array-renderer ${className}`}>
      {content.map((item, index) => {
        if (typeof item === 'string') {
          return <div key={index} className="mb-2">{item}</div>
        }

        if (typeof item === 'object' && item !== null) {
          const type = (item as any).type

          if (type === 'text') {
            return (
              <div key={index} className="mb-2">
                <MarkdownRenderer content={(item as any).text || ''} />
              </div>
            )
          }

          if (type === 'tool_use' || type === 'server_tool_use') {
            return (
              <div key={index} className="mb-4">
                <ToolUseViewer content={JSON.stringify(item, null, 2)} data={item} />
              </div>
            )
          }

          if (type === 'thinking') {
            return (
              <div key={index} className="mb-2">
                <ThinkingViewer content={item} />
              </div>
            )
          }

          if (type === 'tool_result') {
            return (
              <div key={index} className="mb-2">
                <ToolResultViewer content={(item as any).content} />
              </div>
            )
          }
        }

        // Fallback for unknown types
        return (
          <pre key={index} className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded">
            {JSON.stringify(item, null, 2)}
          </pre>
        )
      })}
    </div>
  )
}
