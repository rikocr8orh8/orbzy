import { NextRequest, NextResponse } from 'next/server'

/**
 * Cron job endpoint to auto-escalate overdue bookings
 *
 * Setup with Vercel Cron:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/escalate-bookings",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 *
 * Or use Railway Cron, GitHub Actions, or external cron services
 * Call this endpoint every hour
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authorization (optional but recommended)
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Call the escalation endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/bookings/escalate`, {
      method: 'GET',
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    })
  } catch (error) {
    console.error('Cron escalation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Cron job failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Allow POST for manual triggering
export async function POST(req: NextRequest) {
  return GET(req)
}
