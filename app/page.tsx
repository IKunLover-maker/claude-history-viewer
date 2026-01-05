'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Search, BarChart3, Clock, Calendar, FolderOpen, TrendingUp, User, Bot } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectCard } from '@/components/project-card'
import type { DashboardStats } from '@/app/api/stats/route'

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/stats')
        if (!response.ok) throw new Error('Failed to load stats')
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              Claude Code Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Overview of your conversation history
            </p>
          </div>
          <nav className="flex gap-2">
            <Link
              href="/sessions"
              className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Sessions
            </Link>
            <Link
              href="/search"
              className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
          </nav>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Last 24 Hours
                  </CardTitle>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Sessions</span>
                      <span className="text-2xl font-bold">{stats.lastDayCount}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <User className="w-3 h-3" />
                          {stats.lastDayUserMessages}
                        </span>
                        <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                          <Bot className="w-3 h-3" />
                          {stats.lastDayAssistantMessages}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Last 7 Days
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.lastWeekCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">sessions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total
                  </CardTitle>
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Sessions</span>
                      <span className="text-2xl font-bold">{stats.totalSessions}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <User className="w-3 h-3" />
                          {stats.totalUserMessages}
                        </span>
                        <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                          <Bot className="w-3 h-3" />
                          {stats.totalAssistantMessages}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Projects */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Top 10 Active Projects
              </h2>
              {stats.topProjects.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No projects found
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {stats.topProjects.map((projectStats) => (
                    <ProjectCard key={projectStats.project} stats={projectStats} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
