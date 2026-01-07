/**
 * Unit tests for authentication API endpoints
 * Tests: User signup, login, and email verification flows
 */

import { POST as signupHandler } from '@/app/api/auth/signup/route'
import { GET as verifyEmailHandler } from '@/app/api/auth/verify-email/route'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    emailLog: {
      create: jest.fn(),
    },
  },
}))

// Mock Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'test-email-id' }),
    },
  })),
}))

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}))

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('test-token-123'),
  }),
}))

describe('Authentication API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
        emailVerified: false,
        emailVerificationToken: 'test-token-123',
        tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        address: null,
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.user.create as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.emailLog.create as jest.Mock).mockResolvedValue({})

      const request = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      })

      const response = await signupHandler(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe('User created successfully')
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'test@example.com',
            name: 'Test User',
            emailVerified: false,
          }),
        })
      )
    })

    it('should reject duplicate email addresses', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email: 'test@example.com',
      })

      const request = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      })

      const response = await signupHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email already registered')
    })

    it('should validate required fields', async () => {
      const request = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          // Missing password and name
        }),
      })

      const response = await signupHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('required')
    })

    it('should validate email format', async () => {
      const request = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        }),
      })

      const response = await signupHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('email')
    })

    it('should enforce password length requirements', async () => {
      const request = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: '123', // Too short
          name: 'Test User',
        }),
      })

      const response = await signupHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('password')
    })
  })

  describe('GET /api/auth/verify-email', () => {
    it('should verify email with valid token', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        emailVerified: false,
        emailVerificationToken: 'valid-token',
        tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        emailVerified: true,
        emailVerificationToken: null,
        tokenExpiresAt: null,
      })

      const request = new Request(
        'http://localhost:3000/api/auth/verify-email?token=valid-token'
      )

      const response = await verifyEmailHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Email verified successfully')
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
          tokenExpiresAt: null,
        },
      })
    })

    it('should reject invalid token', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const request = new Request(
        'http://localhost:3000/api/auth/verify-email?token=invalid-token'
      )

      const response = await verifyEmailHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid verification token')
    })

    it('should reject expired token', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        emailVerified: false,
        emailVerificationToken: 'expired-token',
        tokenExpiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const request = new Request(
        'http://localhost:3000/api/auth/verify-email?token=expired-token'
      )

      const response = await verifyEmailHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Verification token has expired')
    })

    it('should handle already verified emails', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        emailVerified: true,
        emailVerificationToken: 'token',
        tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const request = new Request(
        'http://localhost:3000/api/auth/verify-email?token=token'
      )

      const response = await verifyEmailHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Email already verified')
    })

    it('should require token parameter', async () => {
      const request = new Request('http://localhost:3000/api/auth/verify-email')

      const response = await verifyEmailHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Verification token is required')
    })
  })
})
