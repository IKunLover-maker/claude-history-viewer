'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

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

interface ProjectCardProps {
  stats: ProjectStats
}

export function ProjectCard({ stats }: ProjectCardProps) {
  const timeSinceUpdate = formatDistanceToNow(new Date(stats.lastUpdate), {
    addSuffix: true,
  })

  return (
    <Link href={`/sessions?project=${encodeURIComponent(stats.project)}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg truncate flex items-center justify-between">
            <span className="truncate" title={stats.projectName}>
              {stats.projectName}
            </span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Total sessions */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total sessions</span>
            <span className="font-semibold text-lg">{stats.totalSessions}</span>
          </div>

          {/* Recent activity */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Last 24h
            </span>
            <span className={`font-semibold ${stats.recentSessions > 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
              {stats.recentSessions}
            </span>
          </div>

          {/* Messages */}
          <div className="pt-2 border-t space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Messages</span>
              <span className="font-semibold">
                {stats.totalUserMessages + stats.totalAssistantMessages}
              </span>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>User: {stats.totalUserMessages}</span>
              <span>AI: {stats.totalAssistantMessages}</span>
            </div>
            {(stats.recentUserMessages > 0 || stats.recentAssistantMessages > 0) && (
              <div className="flex gap-3 text-xs">
                <span className="text-green-600 dark:text-green-400">
                  Last 24h: User {stats.recentUserMessages}
                </span>
                <span className="text-green-600 dark:text-green-400">
                  AI {stats.recentAssistantMessages}
                </span>
              </div>
            )}
          </div>

          {/* Last update */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Clock className="w-3 h-3" />
            <span>Updated {timeSinceUpdate}</span>
          </div>

          {/* Activity indicator */}
          {stats.recentSessions > 0 && (
            <div className="flex gap-1 pt-2">
              {Array.from({ length: Math.min(stats.recentSessions, 5) }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-green-500"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
