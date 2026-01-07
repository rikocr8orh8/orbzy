'use client'

import { Provider } from '@/utils/types'
import { useState, useEffect } from 'react'

export default function BookingModal({
  task,
  provider,
  allProviders,
  onClose,
  onBook,
}: {
  task: any
  provider: Provider
  allProviders?: Provider[]
  onClose: () => void
  onBook: () => void
}) {
  const [scheduledDate, setScheduledDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [backupProviders, setBackupProviders] = useState<Provider[]>([])

  useEffect(() => {
    // Get backup providers (same category, different from primary)
    if (allProviders) {
      const backups = allProviders
        .filter((p) => p.id !== provider.id && p.type === provider.type)
        .slice(0, 2) // Get top 2 backups
      setBackupProviders(backups)
    }
  }, [allProviders, provider])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: task.id,
        providerId: provider.id,
        scheduledDate,
        notes,
        backupProviderIds: backupProviders.map((p) => p.id),
      }),
    })

    if (res.ok) {
      onBook()
      onClose()
    } else {
      const error = await res.json()
      alert(error.error || 'Booking failed')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Book {provider.name}</h2>
        <form onSubmit={handleSubmit}>
          <p className="text-sm text-gray-600 mb-4">Task: {task.title}</p>

          {/* Provider Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">{provider.name}</p>
                <p className="text-sm text-gray-600">{provider.type}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{provider.rating}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">{provider.address}</p>
            <p className="text-xs text-gray-500">{provider.phone}</p>
          </div>

          {/* 24-Hour Guarantee */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-900">
              <strong>⏰ 24-Hour Confirmation Guarantee</strong>
              <br />
              {provider.name} has 24 hours to confirm. If they don&apos;t respond, we&apos;ll automatically
              connect you with our backup providers.
            </p>
          </div>

          {/* Backup Providers Preview */}
          {backupProviders.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                🛡️ Backup Providers (if needed):
              </p>
              {backupProviders.map((backup, index) => (
                <div key={backup.id} className="text-xs text-gray-600 flex items-center gap-2 mb-1">
                  <span className="font-medium">#{index + 2}</span>
                  <span>{backup.name}</span>
                  <span className="text-yellow-600">⭐ {backup.rating}</span>
                </div>
              ))}
            </div>
          )}

          {/* Scheduled Date */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border rounded mb-3"
          />

          {/* Notes */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Notes (optional)
          </label>
          <textarea
            placeholder="Any specific requirements or concerns?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded mb-4 text-sm"
          />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Fine Print */}
          <p className="text-xs text-gray-500 text-center mt-3">
            By booking, you agree to our terms. The provider will contact you directly to finalize
            details.
          </p>
        </form>
      </div>
    </div>
  )
}
