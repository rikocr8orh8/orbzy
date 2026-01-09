# Stripe Multi-Currency Setup Guide

## Overview
Orbzy uses Stripe for global subscription payments with support for 6 currencies:
- 🇺🇸 USD: $15/month
- 🇪🇺 EUR: €15/month
- 🇬🇧 GBP: £13/month
- 🇦🇺 AUD: $20/month
- 🇳🇿 NZD: $22/month
- 🇨🇦 CAD: $20/month

## Step 1: Stripe Dashboard Configuration

### 1.1 Enable Payment Methods (Already Default)
1. Go to https://dashboard.stripe.com/settings/payment_methods
2. Ensure **Cards** is enabled globally (should be default)

### 1.2 Enable Multiple Currencies
1. Go to https://dashboard.stripe.com/settings/account
2. Under **Customer currency**, enable:
   - USD (United States Dollar)
   - EUR (Euro)
   - GBP (British Pound)
   - AUD (Australian Dollar)
   - NZD (New Zealand Dollar)
   - CAD (Canadian Dollar)

### 1.3 Enable Stripe Tax (Automatic VAT/GST)
1. Go to https://dashboard.stripe.com/settings/tax
2. Click **Enable Stripe Tax**
3. Select tax jurisdictions:
   - **USA**: All states (automatic sales tax)
   - **EU**: All countries (automatic VAT calculation)
   - **Australia, New Zealand, Canada**: Enable GST/VAT

This automatically calculates and collects taxes based on customer location!

### 1.4 Create Products & Price IDs

#### Create the Product:
1. Go to https://dashboard.stripe.com/products
2. Click **+ Add product**
3. Name: `Orbzy Premium`
4. Description: `Unlimited task tracking, access to all providers, smart maintenance reminders`

#### Create 6 Price IDs (one per currency):

For **each currency**, create a recurring monthly price:

**USD Price:**
- Product: Orbzy Premium
- Pricing model: Standard pricing
- Price: `15.00`
- Currency: `USD`
- Billing period: `Monthly`
- Click **Save** and copy the Price ID → Add to `.env` as `STRIPE_PRICE_ID_USD`

**EUR Price:**
- Price: `15.00`
- Currency: `EUR`
- Billing period: `Monthly`
- Copy Price ID → Add to `.env` as `STRIPE_PRICE_ID_EUR`

**GBP Price:**
- Price: `13.00`
- Currency: `GBP`
- Billing period: `Monthly`
- Copy Price ID → Add to `.env` as `STRIPE_PRICE_ID_GBP`

**AUD Price:**
- Price: `20.00`
- Currency: `AUD`
- Billing period: `Monthly`
- Copy Price ID → Add to `.env` as `STRIPE_PRICE_ID_AUD`

**NZD Price:**
- Price: `22.00`
- Currency: `NZD`
- Billing period: `Monthly`
- Copy Price ID → Add to `.env` as `STRIPE_PRICE_ID_NZD`

**CAD Price:**
- Price: `20.00`
- Currency: `CAD`
- Billing period: `Monthly`
- Copy Price ID → Add to `.env` as `STRIPE_PRICE_ID_CAD`

### 1.5 Configure Statement Descriptor
1. Go to https://dashboard.stripe.com/settings/public
2. Under **Statement descriptor**:
   - Shortened descriptor: `ORBZY`
   - Full statement descriptor: `ORBZY SUBSCRIPTION`

This is what appears on customers' credit card statements.

### 1.6 Enable Customer Portal
1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Enable **Customer Portal**
3. Configure allowed actions:
   - ✅ Cancel subscriptions
   - ✅ Update payment methods
   - ✅ View invoice history

## Step 2: Get API Keys

### 2.1 Get Secret Key
1. Go to https://dashboard.stripe.com/apikeys
2. Copy **Secret key** (starts with `sk_live_...` for production or `sk_test_...` for testing)
3. Add to `.env` as `STRIPE_SECRET_KEY`

### 2.2 Get Publishable Key
1. Same page, copy **Publishable key** (starts with `pk_live_...` or `pk_test_...`)
2. Add to `.env` as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Step 3: Configure Webhooks

### 3.1 Create Webhook Endpoint
1. Go to https://dashboard.stripe.com/webhooks
2. Click **+ Add endpoint**
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Description: `Orbzy subscription events`
5. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
6. Click **Add endpoint**

### 3.2 Get Webhook Secret
1. Click on your newly created webhook
2. Click **Reveal** under **Signing secret**
3. Copy the secret (starts with `whsec_...`)
4. Add to `.env` as `STRIPE_WEBHOOK_SECRET`

## Step 4: Railway Environment Variables

Add all variables to Railway:

```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_USD=price_...
STRIPE_PRICE_ID_EUR=price_...
STRIPE_PRICE_ID_GBP=price_...
STRIPE_PRICE_ID_AUD=price_...
STRIPE_PRICE_ID_NZD=price_...
STRIPE_PRICE_ID_CAD=price_...
```

## Step 5: Database Migration

Run Prisma migration to add subscription fields:

```bash
npx prisma db push
```

This adds to the User model:
- `stripeCustomerId`
- `stripeSubscriptionId`
- `stripePriceId`
- `stripeCurrentPeriodEnd`
- `subscriptionStatus`
- `currency`

## Step 6: Test the Integration

### Test Mode (before going live):
1. Use test API keys (`sk_test_...` and `pk_test_...`)
2. Use Stripe test cards: https://stripe.com/docs/testing
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
3. Test each currency
4. Test subscription cancellation via Customer Portal
5. Test webhook events in Stripe Dashboard → Webhooks → Testing

### Live Mode Checklist:
- ✅ All 6 price IDs created
- ✅ Stripe Tax enabled
- ✅ Customer Portal configured
- ✅ Webhook endpoint added
- ✅ Statement descriptor set to "ORBZY"
- ✅ Test purchases completed successfully
- ✅ Railway environment variables updated with live keys

## How It Works

### User Flow:
1. User visits dashboard without subscription
2. Sees `SubscriptionCard` with currency selector (USD, EUR, GBP, AUD, NZD, CAD)
3. Selects currency → clicks "Subscribe"
4. Redirected to Stripe Checkout
5. Stripe automatically:
   - Detects location for tax calculation
   - Shows price in selected currency
   - Calculates VAT/GST/sales tax
   - Collects payment method
6. On successful payment:
   - Webhook fires `checkout.session.completed`
   - User record updated with `stripeCustomerId`, `subscriptionStatus: 'active'`
   - User redirected back to dashboard
7. Dashboard now shows "Active Subscription" status
8. User can click "Manage Subscription" to:
   - Cancel subscription
   - Update payment method
   - View invoices

### Currency Detection:
- Dashboard shows all 6 currency options
- User manually selects their preferred currency
- Stripe handles currency conversion and local payment methods

## Troubleshooting

### Webhook not firing:
- Check webhook endpoint is accessible (Railway deployment URL)
- Verify webhook secret matches `.env`
- Check Stripe Dashboard → Webhooks → Attempts for errors

### Payment fails:
- Check Stripe Dashboard → Logs for error details
- Verify price IDs are correct in `.env`
- Ensure Stripe Tax is enabled for customer's region

### Customer can't access portal:
- Verify `stripeCustomerId` is saved in database
- Check Customer Portal is enabled in Stripe settings

## Support
- Stripe Documentation: https://stripe.com/docs
- Stripe Tax Guide: https://stripe.com/tax
- Multi-Currency: https://stripe.com/docs/currencies
