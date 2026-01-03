import { NextRequest, NextResponse } from 'next/server'
import { exportSession } from '@/lib/claude-history'
import type { ExportFormat } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const format = (searchParams.get('format') || 'md') as ExportFormat

    const content = await exportSession(id, format)

    if (!content) {
      return NextResponse.json(
        { error: 'Session not found or export failed' },
        { status: 404 }
      )
    }

    // Set appropriate content type
    let contentType = 'text/plain'
    let extension = 'txt'

    switch (format) {
      case 'md':
        contentType = 'text/markdown'
        extension = 'md'
        break
      case 'json':
        contentType = 'application/json'
        extension = 'json'
        break
      case 'html':
        contentType = 'text/html'
        extension = 'html'
        break
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="session-${id}.${extension}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting session:', error)
    return NextResponse.json(
      { error: 'Failed to export session' },
      { status: 500 }
    )
  }
}
