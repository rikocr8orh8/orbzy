import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Escalate a booking to the next backup provider
 * Triggered when current provider doesn't respond within 24 hours
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId } = await req.json()

    // Get the booking with all its details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        task: true,
        user: true,
        provider: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify user owns this booking
    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if we have backup providers
    if (booking.backupProviderIds.length === 0) {
      return NextResponse.json(
        { error: 'No backup providers available', fallbackToQuote: true },
        { status: 400 }
      )
    }

    // Check if we've exhausted all providers
    if (booking.currentProviderIndex >= booking.backupProviderIds.length) {
      // All providers tried - update status to failed
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'failed',
          updatedAt: new Date(),
        },
      })

      return NextResponse.json(
        {
          message: 'All providers exhausted',
          fallbackToQuote: true,
          booking: { ...booking, status: 'failed' },
        },
        { status: 200 }
      )
    }

    // Get next provider ID
    const nextProviderId = booking.backupProviderIds[booking.currentProviderIndex]

    // Calculate new 24-hour deadline
    const newDeadline = new Date()
    newDeadline.setHours(newDeadline.getHours() + 24)

    // Update booking to escalate to next provider
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        providerId: nextProviderId,
        status: 'escalated',
        currentProviderIndex: booking.currentProviderIndex + 1,
        escalationAttempts: booking.escalationAttempts + 1,
        lastEscalatedAt: new Date(),
        providerResponseDeadline: newDeadline,
        updatedAt: new Date(),
      },
      include: {
        provider: true,
        task: true,
      },
    })

    // TODO: Send email notification to new provider
    // TODO: Send email notification to user about escalation

    return NextResponse.json({
      message: 'Booking escalated to next provider',
      booking: updatedBooking,
      escalationAttempt: updatedBooking.escalationAttempts,
      newProvider: updatedBooking.provider,
    })
  } catch (error) {
    console.error('Escalation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to escalate booking' },
      { status: 500 }
    )
  }
}

/**
 * Check all pending bookings and auto-escalate if deadline passed
 * This should be called by a cron job every hour
 */
export async function GET(_req: NextRequest) {
  try {
    // Get all pending/escalated bookings past their deadline
    const overdueBookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ['pending', 'escalated'],
        },
        providerResponseDeadline: {
          lte: new Date(), // Deadline has passed
        },
      },
      include: {
        task: true,
        provider: true,
        user: true,
      },
    })

    console.log(`Found ${overdueBookings.length} overdue bookings to escalate`)

    const results = []

    for (const booking of overdueBookings) {
      try {
        // Check if we have backup providers left
        if (booking.currentProviderIndex >= booking.backupProviderIds.length) {
          // No more backups - mark as failed
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              status: 'failed',
              updatedAt: new Date(),
            },
          })

          results.push({
            bookingId: booking.id,
            action: 'failed',
            message: 'All providers exhausted',
          })

          // TODO: Send email to user about failed booking
          continue
        }

        // Get next provider
        const nextProviderId = booking.backupProviderIds[booking.currentProviderIndex]
        const newDeadline = new Date()
        newDeadline.setHours(newDeadline.getHours() + 24)

        // Escalate to next provider
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            providerId: nextProviderId,
            status: 'escalated',
            currentProviderIndex: booking.currentProviderIndex + 1,
            escalationAttempts: booking.escalationAttempts + 1,
            lastEscalatedAt: new Date(),
            providerResponseDeadline: newDeadline,
            updatedAt: new Date(),
          },
        })

        results.push({
          bookingId: booking.id,
          action: 'escalated',
          message: `Escalated to provider ${booking.currentProviderIndex + 1}`,
        })

        // TODO: Send email notifications
      } catch (error) {
        console.error(`Failed to escalate booking ${booking.id}:`, error)
        results.push({
          bookingId: booking.id,
          action: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      message: 'Auto-escalation completed',
      processed: overdueBookings.length,
      results,
    })
  } catch (error) {
    console.error('Auto-escalation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to auto-escalate' },
      { status: 500 }
    )
  }
}
