'use client'

import { useState } from 'react'
import { PRICING_CONFIG, formatPrice, type SupportedCurrency } from '@/lib/stripe'

interface SubscriptionCardProps {
  currentStatus?: string | null
  currentCurrency?: string | null
  currentPeriodEnd?: Date | null
  onSubscribe?: (currency: SupportedCurrency) => void
  onManage?: () => void
}

export default function SubscriptionCard({
  currentStatus,
  currentCurrency,
  currentPeriodEnd,
  onSubscribe,
  onManage,
}: SubscriptionCardProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>(
    (currentCurrency as SupportedCurrency) || 'USD'
  )
  const [loading, setLoading] = useState(false)

  const isActive = currentStatus === 'active' || currentStatus === 'trialing'
  const isPastDue = currentStatus === 'past_due'

  const handleSubscribe = async () => {
    if (!onSubscribe) return
    setLoading(true)
    try {
      await onSubscribe(selectedCurrency)
    } finally {
      setLoading(false)
    }
  }

  const handleManage = async () => {
    if (!onManage) return
    setLoading(true)
    try {
      await onManage()
    } finally {
      setLoading(false)
    }
  }

  if (isActive) {
    return (
      <div className="glass-strong rounded-3xl p-8 border-2 border-green-400/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✅</span>
              <h3 className="text-2xl font-bold text-white">Active Subscription</h3>
            </div>
            <p className="text-purple-200">
              {formatPrice(selectedCurrency)} / month
            </p>
          </div>
          <div className="glass-light px-4 py-2 rounded-full">
            <p className="text-green-400 font-bold text-sm">ACTIVE</p>
          </div>
        </div>

        {currentPeriodEnd && (
          <p className="text-sm text-purple-300 mb-6">
            Next billing date: {new Date(currentPeriodEnd).toLocaleDateString()}
          </p>
        )}

        <button
          onClick={handleManage}
          disabled={loading}
          className="w-full glass-dark px-6 py-3 rounded-xl text-white font-semibold hover:glow transition-all disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Manage Subscription'}
        </button>
      </div>
    )
  }

  if (isPastDue) {
    return (
      <div className="glass-strong rounded-3xl p-8 border-2 border-red-400/30">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-2xl font-bold text-white">Payment Failed</h3>
        </div>
        <p className="text-purple-200 mb-6">
          Your payment failed. Please update your payment method to continue using Orbzy.
        </p>
        <button
          onClick={handleManage}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Update Payment Method'}
        </button>
      </div>
    )
  }

  return (
    <div className="glass-strong rounded-3xl p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-white mb-2">Unlock Full Access</h3>
        <p className="text-purple-200">
          Track unlimited tasks, access all providers, and never miss maintenance
        </p>
      </div>

      {/* Currency Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-purple-200 mb-3">
          Select Your Currency
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(PRICING_CONFIG).map((curr) => {
            const currency = curr as SupportedCurrency
            const isSelected = currency === selectedCurrency
            return (
              <button
                key={currency}
                onClick={() => setSelectedCurrency(currency)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  isSelected
                    ? 'glass-light text-white border-2 border-pink-400'
                    : 'glass-dark text-purple-300 hover:glass-light'
                }`}
              >
                {formatPrice(currency)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {[
          'Unlimited task tracking',
          'Access to all 18+ providers',
          'Smart maintenance reminders',
          'Priority support',
          'Cancel anytime',
        ].map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <span className="text-green-400 text-xl">✓</span>
            <span className="text-purple-200">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
      >
        {loading ? 'Loading...' : `Subscribe for ${formatPrice(selectedCurrency)}/mo`}
      </button>

      <p className="text-xs text-purple-300 text-center mt-4">
        Secure payment via Stripe • Auto-calculated taxes • Cancel anytime
      </p>
    </div>
  )
}
