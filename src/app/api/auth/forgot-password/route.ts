import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import * as brevo from '@getbrevo/brevo'

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent' })
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store token in user record (reusing emailVerificationToken field)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: resetToken,
        tokenExpiresAt,
      },
    })

    // Generate reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`

    // Send reset email using Brevo
    if (process.env.BREVO_API_KEY) {
      const senderEmail = process.env.BREVO_FROM_EMAIL || 'noreply@orbzy.app'
      const senderName = process.env.BREVO_FROM_NAME || 'Orbzy'

      const sendSmtpEmail = new brevo.SendSmtpEmail()
      sendSmtpEmail.sender = { email: senderEmail, name: senderName }
      sendSmtpEmail.to = [{ email: user.email, name: user.name || user.email }]
      sendSmtpEmail.subject = 'Reset your Orbzy password'
      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Password Reset Request</h1>
          <p>Hello ${user.name || 'there'},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Best regards,<br>The Orbzy Team</p>
        </div>
      `

      await apiInstance.sendTransacEmail(sendSmtpEmail)
      console.log('✅ Password reset email sent to:', email)
    } else {
      console.log('📧 Password reset email for:', email)
      console.log('🔗 Reset link:', resetUrl)
    }

    // Log email to database
    await prisma.emailLog.create({
      data: {
        to: email,
        subject: 'Reset your Orbzy password',
        body: `Password reset link: ${resetUrl}`,
      },
    })

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
