'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [verificationUrl, setVerificationUrl] = useState('')
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // Store verification URL for display
      if (data.verificationUrl) {
        setVerificationUrl(data.verificationUrl)
      }

      // Show success message before redirect
      setShowSuccess(true)

      // Redirect after 5 seconds (more time to read the message)
      setTimeout(() => {
        router.push('/auth/login?registered=true')
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-orbzy flex items-center justify-center relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* Success Message */}
        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="glass-strong rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              📧
            </div>
            <h1 className="text-3xl font-bold mb-4 text-white">Check Your Email!</h1>
            <p className="text-purple-200 mb-6">
              Welcome to Orbzy, {name}! We've sent a verification link to your email address.
            </p>
            <div className="glass-light rounded-2xl p-4 mb-4">
              <p className="text-sm text-purple-300 mb-2">
                📬 Please check your inbox and click the verification link to activate your account.
              </p>
              <p className="text-xs text-purple-400">
                The link will expire in 24 hours.
              </p>
            </div>
            {verificationUrl && (
              <div className="glass-dark rounded-2xl p-4 mb-4">
                <p className="text-xs text-purple-300 mb-2">For testing purposes, click below:</p>
                <a
                  href={verificationUrl}
                  className="text-pink-400 hover:text-pink-300 text-sm font-medium break-all"
                >
                  Verify Email Now →
                </a>
              </div>
            )}
            <div className="glass-light rounded-2xl p-3">
              <p className="text-xs text-purple-300">Redirecting to sign in page...</p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-orbzy flex items-center justify-center relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Signup Form */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="glass-strong rounded-3xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6 text-4xl">
            🏠
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center text-white">Create Account</h1>
          <p className="text-center text-purple-200 mb-6">Join Orbzy and get started today</p>

          {error && (
            <div className="glass-light border-2 border-pink-400 rounded-2xl p-4 mb-6">
              <p className="text-pink-300 text-center font-medium">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSignUp}>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 glass-dark rounded-xl mb-4 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />

            <label className="block text-sm font-medium text-purple-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 glass-dark rounded-xl mb-4 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />

            <label className="block text-sm font-medium text-purple-200 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 glass-dark rounded-xl mb-6 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-light px-6 py-4 rounded-2xl text-white font-bold hover:glow transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-purple-200">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-pink-400 hover:text-pink-300 font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-purple-300 hover:text-purple-200 text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
