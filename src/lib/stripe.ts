import Stripe from 'stripe'

// Only initialize Stripe on the server side
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  })
}

// Lazy initialization - only called when needed (server-side API routes)
export const stripe = typeof window === 'undefined' ? getStripe() : (null as unknown as Stripe)

// Multi-currency pricing configuration
export const PRICING_CONFIG = {
  USD: {
    amount: 1500, // $15.00
    currency: 'usd',
    symbol: '$',
    priceId: process.env.STRIPE_PRICE_ID_USD || '',
  },
  EUR: {
    amount: 1500, // €15.00
    currency: 'eur',
    symbol: '€',
    priceId: process.env.STRIPE_PRICE_ID_EUR || '',
  },
  GBP: {
    amount: 1300, // £13.00
    currency: 'gbp',
    symbol: '£',
    priceId: process.env.STRIPE_PRICE_ID_GBP || '',
  },
  AUD: {
    amount: 2000, // $20.00 AUD
    currency: 'aud',
    symbol: 'A$',
    priceId: process.env.STRIPE_PRICE_ID_AUD || '',
  },
  NZD: {
    amount: 2200, // $22.00 NZD
    currency: 'nzd',
    symbol: 'NZ$',
    priceId: process.env.STRIPE_PRICE_ID_NZD || '',
  },
  CAD: {
    amount: 2000, // $20.00 CAD
    currency: 'cad',
    symbol: 'C$',
    priceId: process.env.STRIPE_PRICE_ID_CAD || '',
  },
} as const

export type SupportedCurrency = keyof typeof PRICING_CONFIG

// Country to currency mapping
export const COUNTRY_TO_CURRENCY: Record<string, SupportedCurrency> = {
  // North America
  US: 'USD',
  CA: 'CAD',

  // Europe (Eurozone)
  AT: 'EUR', BE: 'EUR', CY: 'EUR', EE: 'EUR', FI: 'EUR',
  FR: 'EUR', DE: 'EUR', GR: 'EUR', IE: 'EUR', IT: 'EUR',
  LV: 'EUR', LT: 'EUR', LU: 'EUR', MT: 'EUR', NL: 'EUR',
  PT: 'EUR', SK: 'EUR', SI: 'EUR', ES: 'EUR',

  // United Kingdom
  GB: 'GBP',

  // Oceania
  AU: 'AUD',
  NZ: 'NZD',
}

// Detect currency from country code
export function getCurrencyForCountry(countryCode: string | null): SupportedCurrency {
  if (!countryCode) return 'USD'
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] || 'USD'
}

// Format price for display
export function formatPrice(currency: SupportedCurrency): string {
  const config = PRICING_CONFIG[currency]
  const amount = config.amount / 100
  return `${config.symbol}${amount.toFixed(2)}`
}

// Get customer location from IP (using Stripe's automatic location detection)
export async function createCheckoutSession(params: {
  userId: string
  userEmail: string
  currency: SupportedCurrency
  successUrl: string
  cancelUrl: string
}) {
  const config = PRICING_CONFIG[params.currency]

  if (!config.priceId) {
    throw new Error(`Price ID not configured for ${params.currency}`)
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: params.userEmail,
    client_reference_id: params.userId,
    line_items: [
      {
        price: config.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    automatic_tax: {
      enabled: true, // Stripe Tax handles VAT/GST automatically
    },
    tax_id_collection: {
      enabled: true, // Allow customers to enter VAT number
    },
    subscription_data: {
      metadata: {
        userId: params.userId,
      },
    },
  })

  return session
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

// Create customer portal session (for managing subscription)
export async function createCustomerPortalSession(params: {
  customerId: string
  returnUrl: string
}) {
  return await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  })
}
