import { prisma } from '@/lib/prisma'
import * as brevo from '@getbrevo/brevo'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
)

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { taskId, providerId, scheduledDate, notes, backupProviderIds } = await req.json()

    // Calculate 24-hour response deadline
    const responseDeadline = new Date()
    responseDeadline.setHours(responseDeadline.getHours() + 24)

    const booking = await prisma.booking.create({
      data: {
        taskId,
        userId: session.user.id,
        providerId,
        scheduledDate: new Date(scheduledDate),
        notes,
        backupProviderIds: backupProviderIds || [],
        providerResponseDeadline: responseDeadline,
        status: 'pending',
      },
      include: {
        task: true,
        provider: true,
        user: true,
      },
    })

    // Send confirmation email to user
    try {
      const senderEmail = process.env.BREVO_FROM_EMAIL || 'noreply@orbsphere.app'
      const senderName = process.env.BREVO_FROM_NAME || 'ORBSPHERE'

      // Email to user
      const userEmail = new brevo.SendSmtpEmail()
      userEmail.sender = { email: senderEmail, name: senderName }
      userEmail.to = [{ email: booking.user.email, name: booking.user.name || booking.user.email }]
      userEmail.subject = `Booking Confirmation - ${booking.provider.name}`
      userEmail.htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Your appointment is booked!</h2>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Provider:</strong> ${booking.provider.name}</p>
                <p><strong>Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString()}</p>
                <p><strong>Task:</strong> ${booking.task.title}</p>
                <p><strong>Category:</strong> ${booking.task.category}</p>
              </div>
              <p>We've sent the details to ${booking.provider.email}</p>
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                  <strong>⏰ 24-Hour Confirmation Window</strong><br>
                  ${booking.provider.name} has 24 hours to confirm. If they don't respond, we'll automatically reach out to our backup providers to ensure you get service.
                </p>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Thank you for using Orbzy!
              </p>
            </div>
          </body>
        </html>
      `

      await apiInstance.sendTransacEmail(userEmail)

      // Email to provider
      const providerEmail = new brevo.SendSmtpEmail()
      providerEmail.sender = { email: senderEmail, name: senderName }
      providerEmail.to = [{ email: booking.provider.email, name: booking.provider.name }]
      providerEmail.subject = `New Booking Request - ${booking.task.title}`
      providerEmail.htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">You have a new booking request</h2>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Customer:</strong> ${booking.user.name || booking.user.email}</p>
                <p><strong>Email:</strong> ${booking.user.email}</p>
                <p><strong>Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString()}</p>
                <p><strong>Task:</strong> ${booking.task.title}</p>
                <p><strong>Category:</strong> ${booking.task.category}</p>
                <p><strong>Address:</strong> ${booking.user.address || 'Not provided'}</p>
                <p><strong>Notes:</strong> ${booking.notes || 'None'}</p>
              </div>
              <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <p style="margin: 0; color: #991b1b;">
                  <strong>⚠️ URGENT: Please respond within 24 hours</strong><br>
                  To confirm this booking, please contact the customer directly within 24 hours. If we don't hear from you, the booking will be automatically assigned to another provider.
                </p>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Please contact the customer to confirm the appointment details.
              </p>
            </div>
          </body>
        </html>
      `

      await apiInstance.sendTransacEmail(providerEmail)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the booking if email fails
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create booking' },
      { status: 400 }
    )
  }
}
