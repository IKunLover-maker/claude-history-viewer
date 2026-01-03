import { NextRequest, NextResponse } from 'next/server'
import { loadSessionDetail } from '@/lib/claude-history'
import type { SessionDetailResponse } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const detail = await loadSessionDetail(id)

    if (!detail) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Convert Date to ISO string for JSON serialization
    const sessionWithDate = {
      ...detail.session,
      date: detail.session.date.toISOString(),
    }

    const response = {
      session: sessionWithDate,
      messages: detail.messages,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error loading session detail:', error)
    return NextResponse.json(
      { error: 'Failed to load session detail' },
      { status: 500 }
    )
  }
}
