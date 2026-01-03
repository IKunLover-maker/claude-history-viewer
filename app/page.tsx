import Link from "next/link"
import { MessageSquare, Search, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Claude Code History Viewer
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Browse and search your conversation history with Claude Code
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/sessions" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                All Sessions
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                View all your conversation history
              </p>
            </div>
          </Link>

          <Link href="/search" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Search
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Find specific conversations
              </p>
            </div>
          </Link>

          <Link href="/export" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Export
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Export conversations to share
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
