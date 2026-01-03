'use client'

import { useState } from 'react'
import { Eye, Code, Braces } from 'lucide-react'
import { Button } from './ui/button'

interface JsonViewerProps {
  content: string
  data: unknown
  className?: string
}

export function JsonViewer({ content, data, className = '' }: JsonViewerProps) {
  const [showRaw, setShowRaw] = useState(false)

  return (
    <div className={`json-viewer relative group ${className}`}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRaw(!showRaw)}
          className="h-7 px-2 text-xs bg-white dark:bg-slate-800"
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
          {content}
        </pre>
      ) : (
        <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded text-xs overflow-x-auto border border-slate-200 dark:border-slate-800">
          <JSONTree data={data} />
        </pre>
      )}
    </div>
  )
}

interface JSONTreeProps {
  data: unknown
  indent?: number
}

function JSONTree({ data, indent = 0 }: JSONTreeProps) {
  const indentStr = '  '.repeat(indent)

  if (data === null) {
    return <span className="text-purple-600 dark:text-purple-400 font-semibold">null</span>
  }

  if (data === undefined) {
    return <span className="text-slate-400 dark:text-slate-600 italic">undefined</span>
  }

  if (typeof data === 'string') {
    return (
      <span className="text-green-600 dark:text-green-400">
        "{escapeJsonString(data)}"
      </span>
    )
  }

  if (typeof data === 'number') {
    return <span className="text-blue-600 dark:text-blue-400">{data}</span>
  }

  if (typeof data === 'boolean') {
    return <span className="text-amber-600 dark:text-amber-400">{String(data)}</span>
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <>
          <Braces className="w-3 h-3 text-slate-600 dark:text-slate-400 inline" />
          <span className="text-slate-400 dark:text-slate-600">[]</span>
        </>
      )
    }

    return (
      <div>
        <div className="flex items-center">
          <Braces className="w-3 h-3 text-slate-600 dark:text-slate-400" />
          <span className="text-slate-400 dark:text-slate-600 mr-1">[</span>
          <span className="text-slate-500 dark:text-slate-500 text-xs">{data.length}</span>
        </div>
        {data.map((item, index) => (
          <div key={index} className="ml-4">
            <JSONTree data={item} indent={indent + 1} />
            {index < data.length - 1 && <span className="text-slate-400 dark:text-slate-600">,</span>}
          </div>
        ))}
        <div className={indentStr}>
          <span>]</span>
        </div>
      </div>
    )
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data)
    if (keys.length === 0) {
      return (
        <>
          <Braces className="w-3 h-3 text-slate-600 dark:text-slate-400 inline" />
          <span className="text-slate-400 dark:text-slate-600">{`{}`}</span>
        </>
      )
    }

    return (
      <div>
        <div className="flex items-center">
          <Braces className="w-3 h-3 text-slate-600 dark:text-slate-400" />
          <span className="text-slate-400 dark:text-slate-600">{`{`}</span>
        </div>
        {keys.map((key, index) => (
          <div key={key} className="ml-4">
            <span className="text-blue-600 dark:text-blue-400">"{key}"</span>
            <span className="text-slate-400 dark:text-slate-600 mx-1">:</span>
            <JSONTree data={data[key as keyof typeof data]} indent={indent + 1} />
            {index < keys.length - 1 && <span className="text-slate-400 dark:text-slate-600">,</span>}
          </div>
        ))}
        <div className={indentStr}>
          <span>{`}`}</span>
        </div>
      </div>
    )
  }

  return <span className="text-slate-500">{String(data)}</span>
}

function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}
