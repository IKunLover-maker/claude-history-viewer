'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
  ArrowLeft,
  User,
  Bot,
  Download,
  FileText,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  Code,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { JsonViewer } from '@/components/json-viewer'
import { ToolUseViewer, ThinkingViewer, ToolResultViewer } from '@/components/tool-viewer'
import { ContentArrayRenderer } from '@/components/content-array-renderer'
import type { Session, Message } from '@/lib/types'

export default function SessionDetailPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState<'top' | 'bottom' | 'both' | null>(null)
  const [userMessages, setUserMessages] = useState<Array<{ uuid: string; index: number }>>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [showRawMessage, setShowRawMessage] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Load session on mount
  useEffect(() => {
    loadSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  // Extract user messages for timeline
  useEffect(() => {
    const users: Array<{ uuid: string; index: number }> = []
    messages.forEach((msg, idx) => {
      if (msg.type === 'user') {
        users.push({ uuid: msg.uuid, index: idx })
      }
    })
    setUserMessages(users)
  }, [messages])

  // Handle scroll position detection
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const threshold = clientHeight // One page from top/bottom

      if (scrollTop < threshold && scrollTop + clientHeight < scrollHeight - threshold) {
        // Near top but not at bottom
        setShowScrollButton('bottom')
      } else if (scrollTop + clientHeight >= scrollHeight - threshold && scrollTop >= threshold) {
        // Near bottom but not at top
        setShowScrollButton('top')
      } else if (scrollTop >= threshold && scrollTop + clientHeight < scrollHeight - threshold) {
        // In the middle - show both buttons
        setShowScrollButton('both')
      } else {
        // At top or bottom
        setShowScrollButton(null)
      }
    }

    container.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [messages])

  function scrollToTop() {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  function scrollToBottom() {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current?.scrollHeight || 0,
      behavior: 'smooth'
    })
  }

  function scrollToMessage(uuid: string) {
    const element = messageRefs.current.get(uuid)
    if (element && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - 100

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }

  async function loadSession() {
    try {
      const response = await fetch(`/api/sessions/${params.id}`)
      if (!response.ok) {
        throw new Error('Session not found')
      }
      const data = await response.json()
      setSession(data.session)
      setMessages(data.messages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session')
    } finally {
      setLoading(false)
    }
  }

  function handleExport(format: 'md' | 'json' | 'html') {
    const sessionId = session?.sessionId || ''
    window.open(`/api/sessions/${sessionId}/export?format=${format}`, '_blank')
  }

  function renderContent(content: string | unknown): React.ReactNode {
    if (typeof content === 'string') {
      // Try to detect if this is JSON
      if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(content)
          // Check if this is a tool_use
          if (parsed.type === 'tool_use' || parsed.type === 'server_tool_use') {
            return <ToolUseViewer content={content} data={parsed} />
          }
          return <JsonViewer content={content} data={parsed} />
        } catch {
          // Not valid JSON, render as markdown
          return <MarkdownRenderer content={content} />
        }
      }
      return <MarkdownRenderer content={content} />
    }

    // Handle array content (multiple content blocks)
    if (Array.isArray(content)) {
      return <ContentArrayRenderer content={content} />
    }

    // Handle object content (e.g., thinking blocks)
    if (typeof content === 'object' && content !== null) {
      if ('type' in content && content.type === 'thinking') {
        return <ThinkingViewer content={content} />
      }
      // Try to stringify object as JSON
      try {
        const jsonStr = JSON.stringify(content, null, 2)
        return <JsonViewer content={jsonStr} data={content} />
      } catch {
        return <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded">{String(content)}</pre>
      }
    }
    return String(content ?? '')
  }

  function renderMessage(msg: Message) {
    const isRaw = showRawMessage === msg.uuid

    if (msg.type === 'user') {
      return (
        <div
          key={msg.uuid}
          ref={(el) => {
            if (el) messageRefs.current.set(msg.uuid, el)
          }}
          className="flex gap-3 mb-6 scroll-mt-20"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <User className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">You</span>
              {msg.timestamp && (
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowRawMessage(isRaw ? null : msg.uuid)
                }}
                className="h-6 px-2 text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500"
                title={isRaw ? "Show rendered" : "Show raw"}
              >
                {isRaw ? (
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
            <div className="max-w-none rounded-lg bg-green-50/50 dark:bg-green-900/10 p-3">
              {isRaw ? (
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-xs whitespace-pre max-w-full overflow-x-auto">
                  {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null, 2)}
                </pre>
              ) : (
                renderContent(msg.content)
              )}
            </div>
          </div>
        </div>
      )
    }

    if (msg.type === 'assistant') {
      return (
        <div key={msg.uuid} className="flex gap-3 mb-6">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Claude</span>
              {msg.timestamp && (
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowRawMessage(isRaw ? null : msg.uuid)
                }}
                className="h-6 px-2 text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500"
                title={isRaw ? "Show rendered" : "Show raw"}
              >
                {isRaw ? (
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
            <div className="max-w-none">
              {isRaw ? (
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-xs whitespace-pre max-w-full overflow-x-auto">
                  {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null, 2)}
                </pre>
              ) : (
                renderContent(msg.content)
              )}
            </div>
          </div>
        </div>
      )
    }

    if (msg.type === 'tool_use') {
      return (
        <div
          key={msg.uuid}
          ref={(el) => {
            if (el) messageRefs.current.set(msg.uuid, el)
          }}
          className="flex gap-3 mb-6 scroll-mt-20"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tool Use</span>
              {msg.timestamp && (
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowRawMessage(isRaw ? null : msg.uuid)
                }}
                className="h-6 px-2 text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500"
                title={isRaw ? "Show rendered" : "Show raw"}
              >
                {isRaw ? (
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
            <div className="max-w-none">
              {isRaw ? (
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-xs whitespace-pre max-w-full overflow-x-auto">
                  {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null, 2)}
                </pre>
              ) : (
                renderContent(msg.content)
              )}
            </div>
          </div>
        </div>
      )
    }

    if (msg.type === 'tool_result') {
      return (
        <div
          key={msg.uuid}
          ref={(el) => {
            if (el) messageRefs.current.set(msg.uuid, el)
          }}
          className="flex gap-3 mb-6 scroll-mt-20"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tool Result</span>
              {msg.timestamp && (
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowRawMessage(isRaw ? null : msg.uuid)
                }}
                className="h-6 px-2 text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500"
                title={isRaw ? "Show rendered" : "Show raw"}
              >
                {isRaw ? (
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
            <div className="max-w-none rounded-lg bg-teal-50/50 dark:bg-teal-900/10 p-3">
              {isRaw ? (
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-xs whitespace-pre max-w-full overflow-x-auto">
                  {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content, null, 2)}
                </pre>
              ) : (
                renderContent(msg.content)
              )}
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Session Not Found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{error || 'This session does not exist'}</p>
            <Link href="/sessions">
              <Button>Back to Sessions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/sessions">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50 line-clamp-1">
                  {session.display}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {session.projectName} · {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('md')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex justify-center">
        {/* Left Timeline */}
        <aside className="w-16 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto bg-white dark:bg-slate-900">
          <div className="py-4 flex flex-col items-center gap-4">
            {userMessages.map((userMsg, idx) => (
              <button
                key={userMsg.uuid}
                onClick={() => scrollToMessage(userMsg.uuid)}
                className="group relative"
                title={`User message ${idx + 1}`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  User message {idx + 1}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main
          ref={scrollContainerRef}
          className="px-4 py-8 max-w-4xl overflow-y-auto w-full"
          style={{ maxHeight: 'calc(100vh - 73px)' }}
        >
          <Card>
            <CardContent className="p-6">
              {messages.length === 0 ? (
                <p className="text-center text-slate-600 dark:text-slate-400 py-8">
                  No messages in this conversation
                </p>
              ) : (
                messages.map(renderMessage)
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Floating scroll buttons */}
      {showScrollButton && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2">
          {showScrollButton === 'top' || showScrollButton === 'both' ? (
            <Button
              size="icon"
              onClick={scrollToTop}
              className="h-12 w-12 rounded-full shadow-lg"
              title="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          ) : null}
          {showScrollButton === 'bottom' || showScrollButton === 'both' ? (
            <Button
              size="icon"
              onClick={scrollToBottom}
              className="h-12 w-12 rounded-full shadow-lg"
              title="Scroll to bottom"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
