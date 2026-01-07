import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { randomBytes } from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()

  try {
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex')
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerificationToken: verificationToken,
        tokenExpiresAt,
      },
    })

    // Generate verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${verificationToken}`

    // Send verification email using Resend
    try {
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123456789_REPLACE_WITH_YOUR_KEY') {
        // Send real email with Resend
        await resend.emails.send({
          from: 'Orbzy <onboarding@resend.dev>', // Change to your verified domain
          to: email,
          subject: 'Verify your Orbzy account',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #7c3aed;">Welcome to Orbzy! 🏠</h1>
              <p>Hello ${name},</p>
              <p>Thank you for signing up! Please verify your email address to get started.</p>
              <div style="margin: 30px 0;">
                <a href="${verificationUrl}" style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
              <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px;">Best regards,<br>The Orbzy Team</p>
            </div>
          `,
        })
        console.log('✅ Verification email sent via Resend to:', email)
      } else {
        // Fallback to console logging if Resend not configured
        console.log('📧 Verification email for:', email)
        console.log('🔗 Verification link:', verificationUrl)
      }

      // Log email to database
      await prisma.emailLog.create({
        data: {
          to: email,
          subject: 'Verify your Orbzy account',
          body: `Hello ${name},\n\nWelcome to Orbzy! Please verify your email address by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nBest regards,\nThe Orbzy Team`,
        },
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Continue with signup even if email fails
    }

    return NextResponse.json(
      {
        message: 'User created successfully. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        verificationUrl, // Include for testing purposes
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Signup failed' },
      { status: 500 }
    )
  }
}
