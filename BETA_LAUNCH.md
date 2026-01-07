# Orbzy Private Beta Launch Guide

## 🎉 Private Beta Overview

**Status:** FREE Private Beta
**Launch Date:** TBD
**Target Users:** Austin, TX homeowners
**Pricing:** Completely free during beta phase

---

## What's Included in Private Beta

✅ **All Features Unlocked:**
- Unlimited task creation
- Unlimited provider bookings
- Email verification system
- 24-hour provider escalation
- Access to all verified Austin providers
- Priority support

❌ **Payment System:**
- **DISABLED** for private beta
- All features are free
- No credit card required
- No subscription needed

---

## Changes Made for Private Beta

### 1. Removed Stripe Integration
- ✅ Removed `stripe` package from dependencies
- ✅ Removed payment CTA from dashboard
- ✅ Added "Free Private Beta" badge instead
- ✅ Updated landing page messaging

### 2. Updated User Experience
**Landing Page:**
- Badge changed from "Now serving Austin, TX" to "FREE Private Beta • Austin, TX"
- CTA updated to emphasize free beta access

**Dashboard:**
- Removed "Get Started - $15/month" payment button
- Added "You're an Early Adopter!" free beta badge
- Shows all features included for free

### 3. Code Documentation
All payment-related code is commented out with clear instructions for re-enabling:
- Location: [src/app/dashboard/page.tsx:176-203](src/app/dashboard/page.tsx#L176-L203)
- Includes step-by-step re-enablement guide

---

## How to Re-Enable Payments (Public Launch)

When ready to launch publicly with paid plans:

### Step 1: Uncomment Payment Code
In [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx):
1. Remove the "Free Beta Badge" section (lines 155-174)
2. Uncomment the payment CTA (lines 188-202)

### Step 2: Install Stripe
```bash
npm install stripe @stripe/stripe-js
```

### Step 3: Set Up Environment Variables
Add to `.env.local`:
```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 4: Create Stripe Checkout API Route
Create `src/app/api/create-checkout-session/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_YOUR_STRIPE_PRICE_ID', // Create in Stripe Dashboard
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=cancelled`,
      customer_email: session.user.email,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

### Step 5: Update Database Schema
Add subscription fields to User model in `prisma/schema.prisma`:
```prisma
model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  password              String
  name                  String?
  address               String?
  emailVerified         Boolean   @default(false)
  emailVerificationToken String?  @unique
  tokenExpiresAt        DateTime?

  // Payment fields (add these)
  stripeCustomerId      String?   @unique
  stripeSubscriptionId  String?   @unique
  subscriptionStatus    String?   // active, canceled, past_due, etc.
  subscriptionPlan      String?   // free, premium

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  tasks         Task[]
  bookings      Booking[]

  @@map("users")
}
```

Run migration:
```bash
npx prisma db push
```

### Step 6: Create Stripe Webhook Handler
Create `src/app/api/webhooks/stripe/route.ts` to handle subscription events

### Step 7: Update Landing Page
Revert landing page changes:
- Change "FREE Private Beta" back to pricing messaging
- Update CTA buttons

### Step 8: Update Tests
Add payment flow tests:
- Unit tests for Stripe integration
- E2E tests for checkout flow

### Step 9: Deploy & Test
1. Test with Stripe test cards
2. Verify webhook handling
3. Test subscription lifecycle (create, cancel, renew)

---

## Private Beta Testing Checklist

Before inviting beta users:

### Technical Setup
- [x] Stripe dependency removed
- [x] Payment CTA replaced with free beta badge
- [x] Landing page updated
- [x] Dashboard updated
- [ ] All tests passing
- [ ] Production build succeeds
- [ ] Environment variables configured on Railway

### Beta User Onboarding
- [ ] Create welcome email template
- [ ] Set up beta user support channel
- [ ] Prepare FAQ document
- [ ] Create feedback collection form

### Monitoring
- [ ] Error tracking enabled (Sentry recommended)
- [ ] User analytics set up (optional)
- [ ] Email delivery monitoring
- [ ] Database backups enabled

---

## Beta User Communication

### Signup Email (After Verification)
```
Subject: Welcome to Orbzy Private Beta! 🏠

Hi [Name],

Thank you for joining the Orbzy private beta! You're among the first Austin homeowners to experience our AI-powered home maintenance matching platform.

🎉 What's Included (100% Free):
• Unlimited task creation
• Unlimited provider bookings
• Access to all verified Austin providers
• Priority beta user support

🚀 Getting Started:
1. Log in to your dashboard
2. Create your first maintenance task
3. Browse matching providers
4. Book appointments directly

💬 We Want Your Feedback:
As a beta user, your feedback is invaluable. Please share your experience, suggestions, and any issues you encounter.

Questions? Reply to this email anytime.

Best,
The Orbzy Team
```

### Beta Expectations Email
```
Subject: What to Expect During Beta

Hi [Name],

As a private beta user, here's what to expect:

✅ What Works:
• Full account creation & login
• Task scheduling
• Provider matching
• Booking appointments
• Email notifications

🔄 What We're Improving:
• Provider response times
• Matching algorithm
• Mobile app (coming soon)

🆓 Pricing:
Everything is FREE during the private beta. When we launch publicly, early beta users will receive:
• [Define beta user benefits - e.g., lifetime discount, extended free trial, etc.]

Thank you for helping us build Orbzy!
```

---

## Collecting Beta Feedback

### In-App Feedback (Optional Enhancement)
Add a feedback button in the dashboard:
```typescript
// Add to dashboard
<button className="glass-light px-4 py-2 rounded-xl">
  💬 Share Feedback
</button>
```

### Google Form / Typeform
Create a feedback form with questions like:
- How easy was it to create a task? (1-5)
- Did you successfully book a provider? (Yes/No)
- What features are missing?
- What would you improve?
- Would you recommend Orbzy to friends? (1-10)

### Weekly Check-ins
Send weekly emails asking:
- What went well this week?
- What didn't work?
- What would you like to see next?

---

## Beta Success Metrics

Track these during beta:

### User Engagement
- [ ] Number of signups
- [ ] Tasks created per user
- [ ] Bookings completed
- [ ] Daily/weekly active users

### Technical Performance
- [ ] Page load times
- [ ] Error rates
- [ ] Email delivery rate
- [ ] Database query performance

### User Satisfaction
- [ ] Net Promoter Score (NPS)
- [ ] Feature satisfaction scores
- [ ] Support ticket volume
- [ ] User retention rate

---

## Timeline to Public Launch

**Suggested timeline:**

### Week 1-2: Private Beta Launch
- Invite 10-20 beta users
- Monitor closely for critical bugs
- Fix any blocking issues

### Week 3-4: Expand Beta
- Invite 50-100 more users
- Gather feedback
- Iterate on features

### Week 5-6: Feature Polish
- Implement top feature requests
- Improve UX based on feedback
- Performance optimizations

### Week 7-8: Payment Integration
- Implement Stripe (follow re-enablement guide above)
- Test payment flows thoroughly
- Set pricing strategy

### Week 9: Pre-Launch Prep
- Final bug fixes
- Marketing materials ready
- Public website updates

### Week 10: Public Launch 🚀
- Open signups to public
- Activate payment system
- Monitor and support

---

## Post-Beta Migration

When transitioning from beta to paid:

### Option 1: Grandfather Beta Users
- Keep all beta users on free plan forever
- Good for loyalty and word-of-mouth

### Option 2: Beta User Discount
- Offer 50% off lifetime or first year
- Good for revenue while rewarding early adopters

### Option 3: Extended Free Trial
- Give beta users 6-12 months free
- Then require subscription

**Recommended:** Option 2 (Beta user discount)

---

## Support During Beta

### Expected Beta User Questions

**Q: How long will beta last?**
A: We expect the private beta to run for 8-10 weeks before public launch.

**Q: Will I need to pay later?**
A: Yes, we'll introduce paid plans at public launch, but beta users will receive special pricing.

**Q: What happens to my data after beta?**
A: All your tasks, bookings, and account data will remain intact.

**Q: Can I invite friends?**
A: Yes! Share your referral code: [implement referral system]

**Q: What if a provider doesn't respond?**
A: Our 24-hour escalation system automatically connects you with backup providers.

---

## Files Modified for Beta

```
✅ package.json              - Removed stripe dependency
✅ src/app/dashboard/page.tsx - Replaced payment with free badge
✅ src/app/page.tsx          - Updated landing page messaging
✅ BETA_LAUNCH.md           - This file (documentation)
```

**Payment code preserved in comments** for easy re-enablement at public launch.

---

## Next Steps

1. **Complete testing** - Run full test suite
2. **Deploy to production** - Railway deployment
3. **Invite first batch** - Start with 10-20 trusted users
4. **Monitor closely** - Watch for errors and feedback
5. **Iterate quickly** - Fix issues within 24-48 hours
6. **Collect feedback** - Weekly surveys
7. **Plan public launch** - 8-10 weeks timeline

---

**Questions?** Review this guide or check [TESTING.md](TESTING.md) for testing procedures.

**Ready to launch?** Follow the [Manual Smoke Test Checklist](TESTING.md#manual-smoke-test-checklist) before inviting users.

---

**Last Updated:** 2026-01-06
**Version:** Private Beta v1.0
