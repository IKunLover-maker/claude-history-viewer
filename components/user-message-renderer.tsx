'use client'

import { MarkdownRenderer } from './markdown-renderer'
import { parseXmlSummaries, ParsedXmlContent } from '@/lib/xml-utils'

interface UserMessageRendererProps {
  content: string | unknown
  isRaw: boolean
  className?: string
}

/**
 * Renders the list of extracted summaries with a section header.
 */
function SummaryList({ summaries }: { summaries: string[] }) {
  if (summaries.length === 0) return null

  return (
    <div className="mb-3">
      <h4 className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">
        Summaries ({summaries.length})
      </h4>
      <div className="space-y-2">
        {summaries.map((summary, index) => (
          <div key={index} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 mt-1" />
            <div className="flex-1 min-w-0">
              <MarkdownRenderer content={summary} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Renders non-XML content (text outside XML tags) with a section header.
 */
function NonXmlContent({ content }: { content: string }) {
  if (!content.trim()) return null

  return (
    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
      <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
        Additional Content
      </h4>
      <MarkdownRenderer content={content} />
    </div>
  )
}

/**
 * User message renderer that supports XML summary extraction.
 *
 * Features:
 * - Raw mode: Shows original content as formatted text
 * - Rendered mode: Extracts and displays <summary> tags from XML
 * - Falls back to markdown rendering for non-XML content
 */
export function UserMessageRenderer({ content, isRaw, className = '' }: UserMessageRendererProps) {
  // Raw mode: show original content (existing behavior)
  if (isRaw) {
    return (
      <pre className={`bg-slate-100 dark:bg-slate-800 p-4 rounded text-xs whitespace-pre max-w-full overflow-x-auto ${className}`}>
        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
      </pre>
    )
  }

  // If content is not a string, handle as JSON
  if (typeof content !== 'string') {
    return (
      <pre className={`bg-slate-100 dark:bg-slate-800 p-4 rounded text-xs whitespace-pre max-w-full overflow-x-auto ${className}`}>
        {JSON.stringify(content, null, 2)}
      </pre>
    )
  }

  // Parse XML for summaries
  const parsed = parseXmlSummaries(content)

  // If no XML structure with summaries found, render as markdown (existing behavior)
  if (!parsed.hasXmlStructure) {
    return <MarkdownRenderer content={content} className={className} />
  }

  // Display extracted summaries and non-XML content
  return (
    <div className={className}>
      <SummaryList summaries={parsed.summaries} />
      <NonXmlContent content={parsed.nonXmlContent} />
    </div>
  )
}
