'use client'

import { Provider } from '@/utils/types'
import { useState } from 'react'

export default function ProviderCard({
  provider,
  onBook,
}: {
  provider: Provider
  onBook: (providerId: string) => void
}) {
  const [loading, setLoading] = useState(false)

  const handleBook = () => {
    setLoading(true)
    onBook(provider.id)
    setLoading(false)
  }

  return (
    <div className="glass-light rounded-2xl p-5 hover:glass-strong transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-white mb-1">{provider.name}</h3>
          <p className="text-sm text-purple-300">{provider.type}</p>
        </div>
        <div className="flex items-center gap-1 glass-dark px-3 py-1 rounded-full">
          <span className="text-yellow-400">⭐</span>
          <span className="text-white font-semibold">{provider.rating}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-purple-200 flex items-center gap-2">
          <span>📞</span>
          <span>{provider.phone}</span>
        </p>
        <p className="text-sm text-purple-200 flex items-center gap-2">
          <span>📍</span>
          <span>{provider.address}</span>
        </p>
      </div>

      <button
        onClick={handleBook}
        disabled={loading}
        className="w-full glass-dark px-4 py-3 rounded-xl text-white font-semibold hover:glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Booking...' : 'Book Now'}
      </button>
    </div>
  )
}
