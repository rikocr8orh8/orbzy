'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function Navbar() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="relative z-20 pt-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass rounded-2xl px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex items-center justify-center text-2xl">
              🏠
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Orbzy</h1>
              <p className="text-xs text-purple-200">Home Maintenance</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="glass-light px-6 py-2 rounded-xl text-white font-medium hover:glass-strong transition-all disabled:opacity-50"
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  )
}
