import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // NextAuth handles logout via client-side signOut()
  // This endpoint is not needed but kept for compatibility
  return NextResponse.json({ success: true, message: 'Use signOut() from next-auth/react on client' })
}
