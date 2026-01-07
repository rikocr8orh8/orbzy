'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function VerifyEmailForm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      const res = await fetch(`/api/auth/verify-email?token=${token}`)
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message)

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?verified=true')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Verification failed')
      }
    } catch (err) {
      setStatus('error')
      setMessage('An error occurred during verification')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-orbzy flex items-center justify-center relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Verification Status */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="glass-strong rounded-3xl p-12 text-center">
          {status === 'loading' && (
            <>
              <div className="flex items-center justify-center text-5xl mx-auto mb-6 animate-spin">
                🏠
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white">Verifying Email...</h1>
              <p className="text-purple-200">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
                ✅
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white">Email Verified!</h1>
              <p className="text-purple-200 mb-6">{message}</p>
              <div className="glass-light rounded-2xl p-4">
                <p className="text-sm text-purple-300">Redirecting to sign in page...</p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                ❌
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white">Verification Failed</h1>
              <p className="text-purple-200 mb-6">{message}</p>
              <div className="space-y-4">
                <Link
                  href="/auth/signup"
                  className="block glass-light px-6 py-3 rounded-2xl text-white font-semibold hover:glow transition-all"
                >
                  Sign up again
                </Link>
                <Link
                  href="/auth/login"
                  className="block text-purple-300 hover:text-purple-200"
                >
                  Back to sign in
                </Link>
              </div>
            </>
          )}

          <div className="mt-6">
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

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-orbzy flex items-center justify-center">
        <div className="glass rounded-3xl p-8">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}
