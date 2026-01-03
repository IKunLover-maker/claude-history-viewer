'use client'

import { useState } from 'react'
import { Eye, Code, Zap, FileText } from 'lucide-react'
import { Button } from './ui/button'

interface ToolUseViewerProps {
  content: string
  data: unknown
  className?: string
}

function parseToolUse(content: string, data: unknown): { name: string; input: string; originalContent: string } | null {
  try {
    const parsed = JSON.parse(content)
    if (parsed.type === 'tool_use' || parsed.type === 'server_tool_use') {
      return {
        name: parsed.name || 'Tool',
        input: parsed.input ? JSON.stringify(parsed.input, null, 2) : '{}',
        originalContent: content
      }
    }
  } catch {
    // Not valid JSON
  }
  return null
}

export function ToolUseViewer({ content, data, className = '' }: ToolUseViewerProps) {
  const [showRaw, setShowRaw] = useState(false)

  const toolInfo = parseToolUse(content, data)

  if (toolInfo) {
    return (
    <div className={`tool-use-viewer ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span className="font-mono text-sm text-purple-600 dark:text-purple-400">
          {toolInfo.name}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRaw(!showRaw)}
          className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
        >
          {showRaw ? (
            <>
              <Eye className="w-3 h-3 mr-1" />
              Formatted
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
          {toolInfo.originalContent}
        </pre>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900 rounded p-4">
          <pre className="text-xs whitespace-pre-wrap break-words">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">⏺ {toolInfo.name}()</span>
            <span className="text-slate-600 dark:text-slate-400">{toolInfo.input}</span>
          </pre>
        </div>
      )}
    </div>
  )
  }

  return null
}

interface ThinkingViewerProps {
  content: unknown
  className?: string
}

export function ThinkingViewer({ content, className = '' }: ThinkingViewerProps) {
  const [expanded, setExpanded] = useState(false)

  if (typeof content === 'object' && content !== null && 'type' in content && content.type === 'thinking') {
    const thinkingStr = String((content as any).thinking || '')

    return (
      <div className={`bg-slate-100 dark:bg-slate-800 rounded p-3 my-2 ${className}`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span>Thinking</span>
          <span className="ml-2 text-xs text-slate-500">
            {expanded ? '▼' : '▶'}
          </span>
        </button>
        {expanded && (
          <pre className="mt-2 text-xs whitespace-pre-wrap text-slate-600 dark:text-slate-400">
            {thinkingStr}
          </pre>
        )}
      </div>
    )
  }

  return null
}

interface ToolResultViewerProps {
  content: unknown
  className?: string
}

export function ToolResultViewer({ content, className = '' }: ToolResultViewerProps) {
  if (typeof content === 'string') {
    let displayContent = content
    if (content.length > 200) {
      displayContent = content.substring(0, 200) + '...'
    }

    return (
      <details className="group bg-green-50 dark:bg-green-900/20 rounded p-3 my-2">
        <summary className="cursor-pointer text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Tool Result</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs ml-auto">
            ({content.length} chars)
          </span>
        </summary>
        <pre className="mt-2 text-xs whitespace-pre-wrap break-words max-w-full overflow-x-auto">
          {displayContent}
        </pre>
      </details>
    )
  }

  if (typeof content === 'object' && content !== null) {
    const contentStr = JSON.stringify(content, null, 2)
    return (
      <details className="group bg-green-50 dark:bg-green-900/20 rounded p-3 my-2">
        <summary className="cursor-pointer text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Tool Result</span>
        </summary>
        <pre className="mt-2 text-xs whitespace-pre-wrap break-words max-w-full overflow-x-auto">
          {contentStr}
        </pre>
      </details>
    )
  }

  return null
}
