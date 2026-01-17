'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setSuccess(true)
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
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

          <h1 className="text-3xl font-bold mb-2 text-center text-white">Reset Password</h1>
          <p className="text-center text-purple-200 mb-6">
            Enter your email and we&apos;ll send you a reset link
          </p>

          {success ? (
            <div className="glass-light border-2 border-green-400 rounded-2xl p-4 mb-6">
              <p className="text-green-300 text-center font-medium">
                If an account exists with that email, you&apos;ll receive a password reset link shortly.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="glass-light border-2 border-pink-400 rounded-2xl p-4 mb-6">
                  <p className="text-pink-300 text-center font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 glass-dark rounded-xl mb-6 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full glass-light px-6 py-4 rounded-2xl text-white font-bold hover:glow transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

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
