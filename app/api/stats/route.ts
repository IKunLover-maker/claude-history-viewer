import { NextResponse } from 'next/server'
import { loadSessionsList, loadSessionDetail } from '@/lib/claude-history'

export const dynamic = 'force-dynamic'

interface ProjectStats {
  project: string
  projectName: string
  totalSessions: number
  lastUpdate: number
  recentSessions: number
  totalUserMessages: number
  totalAssistantMessages: number
  recentUserMessages: number
  recentAssistantMessages: number
}

export interface DashboardStats {
  lastDayCount: number
  lastWeekCount: number
  totalSessions: number
  totalUserMessages: number
  totalAssistantMessages: number
  lastDayUserMessages: number
  lastDayAssistantMessages: number
  topProjects: ProjectStats[]
}

export async function GET() {
  try {
    const sessions = await loadSessionsList()
    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000
    const oneWeekMs = 7 * oneDayMs

    // Calculate time-based counts
    const lastDayCount = sessions.filter(s => s.timestamp > now - oneDayMs).length
    const lastWeekCount = sessions.filter(s => s.timestamp > now - oneWeekMs).length

    // Count messages by type (sample recent sessions for performance)
    const recentSessions = sessions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100) // Only count messages from last 100 sessions for performance

    let totalUserMessages = 0
    let totalAssistantMessages = 0
    let lastDayUserMessages = 0
    let lastDayAssistantMessages = 0

    for (const session of recentSessions) {
      try {
        const detail = await loadSessionDetail(session.sessionId)
        if (detail) {
          for (const msg of detail.messages) {
            const msgTime = msg.timestamp ? new Date(msg.timestamp).getTime() : 0
            const isLastDay = msgTime > now - oneDayMs

            if (msg.type === 'user') {
              totalUserMessages++
              if (isLastDay) lastDayUserMessages++
            } else if (msg.type === 'assistant') {
              totalAssistantMessages++
              if (isLastDay) lastDayAssistantMessages++
            }
          }
        }
      } catch {
        // Skip sessions that fail to load
        continue
      }
    }

    // Aggregate by project with message counts
    const projectMap = new Map<string, ProjectStats>()

    for (const session of sessions) {
      const key = session.project
      if (!projectMap.has(key)) {
        projectMap.set(key, {
          project: session.project,
          projectName: session.projectName,
          totalSessions: 0,
          lastUpdate: session.timestamp,
          recentSessions: 0,
          totalUserMessages: 0,
          totalAssistantMessages: 0,
          recentUserMessages: 0,
          recentAssistantMessages: 0,
        })
      }
      const stats = projectMap.get(key)!
      stats.totalSessions++
      if (session.timestamp > now - oneDayMs) {
        stats.recentSessions++
      }
      if (session.timestamp > stats.lastUpdate) {
        stats.lastUpdate = session.timestamp
      }

      // Count messages for this session
      try {
        const detail = await loadSessionDetail(session.sessionId)
        if (detail) {
          for (const msg of detail.messages) {
            const msgTime = msg.timestamp ? new Date(msg.timestamp).getTime() : 0
            const isLastDay = msgTime > now - oneDayMs

            if (msg.type === 'user') {
              stats.totalUserMessages++
              if (isLastDay) stats.recentUserMessages++
            } else if (msg.type === 'assistant') {
              stats.totalAssistantMessages++
              if (isLastDay) stats.recentAssistantMessages++
            }
          }
        }
      } catch {
        // Skip sessions that fail to load
        continue
      }
    }

    // Sort by last update time and take top 10
    const topProjects = Array.from(projectMap.values())
      .sort((a, b) => b.lastUpdate - a.lastUpdate)
      .slice(0, 10)

    const response: DashboardStats = {
      lastDayCount,
      lastWeekCount,
      totalSessions: sessions.length,
      totalUserMessages,
      totalAssistantMessages,
      lastDayUserMessages,
      lastDayAssistantMessages,
      topProjects,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to load dashboard stats' },
      { status: 500 }
    )
  }
}
