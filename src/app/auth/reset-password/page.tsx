'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      router.push('/auth/login?reset=true')
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-orbzy flex items-center justify-center">
        <div className="glass-strong rounded-3xl p-8 max-w-md mx-4">
          <h1 className="text-2xl font-bold text-center text-white mb-4">Invalid Link</h1>
          <p className="text-purple-200 text-center mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/auth/forgot-password"
            className="block text-center glass-light px-6 py-3 rounded-xl text-white hover:glow transition-all"
          >
            Request New Link
          </Link>
        </div>
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

      {/* Form */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="glass-strong rounded-3xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6 text-4xl">
            🏠
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center text-white">New Password</h1>
          <p className="text-center text-purple-200 mb-6">
            Enter your new password below
          </p>

          {error && (
            <div className="glass-light border-2 border-pink-400 rounded-2xl p-4 mb-6">
              <p className="text-pink-300 text-center font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 glass-dark rounded-xl mb-4 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />

            <label className="block text-sm font-medium text-purple-200 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 glass-dark rounded-xl mb-6 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-light px-6 py-4 rounded-2xl text-white font-bold hover:glow transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="text-center">
            <Link href="/auth/login" className="text-purple-300 hover:text-purple-200 text-sm">
              ← Back to sign in
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

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-orbzy flex items-center justify-center">
        <div className="glass rounded-3xl p-8">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
