# Orbzy Product Roadmap

## ✅ COMPLETED (Ready to Deploy)

### Core Features
- ✅ User authentication (NextAuth + email verification)
- ✅ Task tracking and management
- ✅ Provider booking system
- ✅ Email notifications (Resend)
- ✅ Legal disclaimers (provider liability protection)

### Payment System
- ✅ Stripe multi-currency subscriptions (USD, EUR, GBP, AUD, NZD, CAD)
- ✅ Automatic tax calculation (Stripe Tax)
- ✅ Customer portal (manage subscriptions)
- ✅ Webhook handling (subscription events)

### Provider Discovery
- ✅ Google Places API integration
- ✅ Global provider search (any location)
- ✅ Smart caching (7-day database cache)
- ✅ Quality filtering (4+ stars, 50+ reviews)
- ✅ Auto-storage in database

### Infrastructure
- ✅ PostgreSQL database (Railway)
- ✅ Next.js 14 App Router
- ✅ Prisma ORM
- ✅ Railway deployment
- ✅ Production-ready build

---

## 🚀 PHASE 1: Launch with Competitive Free Tier

### Updated Pricing Strategy (Beats Competitors)

#### 🏠 Homeowner Free (Beats HomeZada Essentials/Dib.io)
**Free Tier:**
- ✅ Track 1 property
- ✅ Create up to **5 tasks** (up from 3 - more generous than competitors)
- ✅ View providers (read-only)
- ✅ Basic email reminders (1 per task)
- ❌ No booking
- ❌ No history export
- ❌ No priority support

**Premium: $4.99/mo** *(70% cheaper than HomeZada's $15/mo)*
- ✅ Unlimited tasks
- ✅ Book providers
- ✅ Push notifications
- ✅ Full history export
- ✅ Multi-property support
- ✅ Priority support

**Value Prop:** Same features as HomeZada Premium but $10/mo cheaper

---

#### 🔧 Service Provider Free (Builds supply side)
**Free Tier:**
- ✅ Create profile + basic listing
- ✅ Manage up to **5 jobs** (increased from 3)
- ✅ View incoming leads (read-only)
- ❌ No lead responses
- ❌ No booking acceptance
- ❌ No invoicing

**Premium: $29/mo** *(40% cheaper than original $49)*
- ✅ Full CRM
- ✅ Unlimited jobs
- ✅ Respond to leads
- ✅ Invoicing tools
- ✅ Priority matching in search
- ✅ Client portal

**Value Prop:** Cheaper than Jobber ($49/mo) or ServiceTitan ($169/mo)

---

#### 🏢 Real Estate Agent Free (Post-closing value-add)
**Free Tier:**
- ✅ Track 1 listing/client
- ✅ Create/view basic tasks for that client
- ❌ No bulk creation
- ❌ No vendor coordination
- ❌ No branding
- ❌ No analytics

**Premium: $15/mo** *(50% cheaper than original $29)*
- ✅ Up to 20 clients/year
- ✅ Bulk task creation
- ✅ Branded tasks (client gifting tool)
- ✅ Referral tracking
- ✅ Vendor coordination

**Value Prop:** Cheaper than Follow Up Boss ($69/mo) or BoomTown ($250/mo)

---

#### 🏘️ Landlord/Property Manager Free
**Free Tier:**
- ✅ Track up to **5 properties** (up from 3)
- ✅ Basic task creation per property
- ❌ No bulk/recurring operations
- ❌ No owner reports
- ❌ No tenant assignment

**Premium: $29/mo** *(70% cheaper than original $99)*
- ✅ Unlimited properties (up to 50 units)
- ✅ Bulk scheduling
- ✅ Recurring maintenance automation
- ✅ Owner reports
- ✅ Tenant tools

**Value Prop:** Cheaper than Buildium ($50/mo) or AppFolio ($280/mo)

---

## 💰 Revenue Projections (Updated)

### Conservative Estimate (6 months)
| User Type | Free Users | Paid Users | Price | MRR |
|-----------|------------|------------|-------|-----|
| Homeowner | 500 | 50 (10%) | $4.99 | $250 |
| Provider | 100 | 10 (10%) | $29 | $290 |
| Agent | 50 | 5 (10%) | $15 | $75 |
| Property Manager | 30 | 3 (10%) | $29 | $87 |
| **TOTAL** | **680** | **68** | - | **$702/mo** |

### Growth Target (12 months)
| User Type | Free Users | Paid Users | Price | MRR |
|-----------|------------|------------|-------|-----|
| Homeowner | 2,000 | 300 (15%) | $4.99 | $1,497 |
| Provider | 400 | 60 (15%) | $29 | $1,740 |
| Agent | 200 | 30 (15%) | $15 | $450 |
| Property Manager | 100 | 15 (15%) | $29 | $435 |
| **TOTAL** | **2,700** | **405** | - | **$4,122/mo** |

**ARR at 12 months:** ~$50K

---

## 📋 Implementation: Free Tier Limits

### Technical Implementation

```typescript
// Add to User schema
tier: String @default("free") // free, premium

// Free tier limits by role
const FREE_LIMITS = {
  homeowner: {
    properties: 1,
    tasks: 5,
    canBook: false,
    reminders: 'email_only', // no push
  },
  provider: {
    jobs: 5,
    canRespond: false,
    canInvoice: false,
  },
  agent: {
    clients: 1,
    bulkOps: false,
    branding: false,
  },
  property_manager: {
    properties: 5,
    bulkOps: false,
    reports: false,
  },
}

// Middleware to check limits
function canCreateTask(user: User, taskCount: number) {
  if (user.tier === 'premium') return true
  
  const limit = FREE_LIMITS[user.role].tasks
  return taskCount < limit
}
```

### UI Changes Needed
1. **Upgrade prompts** when hitting limits
2. **Feature badges** ("Premium" labels)
3. **Comparison table** on pricing page
4. **Progress indicators** ("3/5 tasks used")

---

## 🎯 GO-TO-MARKET Strategy

### Phase 1: Free Tier Launch (Week 1-2)

**Target: 100 free signups in 2 weeks**

#### Homeowner Acquisition
- **Reddit:** r/homeowners, r/homeimprovement, r/FirstTimeHomeBuyer
- **Content:** "I built a free home maintenance tracker (no catch)"
- **Landing page:** "Free forever. Track 5 tasks. No credit card."

#### Provider Acquisition
- **Facebook Groups:** Local contractor groups
- **Direct outreach:** "Free CRM for first 5 jobs - test it out"
- **Value:** Show incoming leads even on free tier (can't respond)

#### Agent Acquisition
- **LinkedIn:** DM recent closers
- **Pitch:** "Gift this to your clients post-closing"
- **Angle:** Relationship tool, not just CRM

#### Property Manager Acquisition
- **BiggerPockets forums**
- **NARPM (National Assoc of Residential Property Managers)**
- **Content:** "Track 5 properties for free"

### Phase 2: Conversion Optimization (Week 3-4)

**Target: 10% free-to-paid conversion**

- **In-app prompts:** When hitting limits
- **Email sequence:**
  - Day 3: Tips for using free tier
  - Day 7: "You're at 4/5 tasks - upgrade?"
  - Day 14: Case study of premium user
  - Day 30: Limited-time discount
- **Social proof:** Show # of providers in area (premium only)

### Phase 3: Paid Growth (Month 2-3)

**Budget: $500/month**

- **Google Ads:** "home maintenance app" ($100)
- **Facebook Ads:** Property managers ($200)
- **Reddit Ads:** r/landlord ($100)
- **LinkedIn Ads:** Real estate agents ($100)

---

## 🚀 Launch Checklist

### Technical Setup (Do Now)
- [ ] Push code to GitHub
- [ ] Get Google Places API key
- [ ] Create Stripe prices (now 4 tiers × 6 currencies = 24 price IDs)
  - Homeowner: $4.99 USD, €4.99 EUR, £3.99 GBP, $6.99 AUD, $7.99 NZD, $6.49 CAD
  - Provider: $29 (all currencies)
  - Agent: $15 (all currencies)
  - Property Manager: $29 (all currencies)
- [ ] Set up webhook
- [ ] Add env vars to Railway
- [ ] Deploy

### Pre-Launch (Week 0)
- [ ] Update landing page with new pricing
- [ ] Create "Free Forever" badge/section
- [ ] Write launch post for Reddit
- [ ] Prepare Product Hunt launch
- [ ] Set up analytics (PostHog/Mixpanel)
- [ ] Create demo video (Loom)

### Launch Week
- [ ] Post on Product Hunt
- [ ] 5 Reddit posts (different subreddits)
- [ ] Direct outreach: 20 property managers
- [ ] Email 10 real estate agents you know
- [ ] Share on Twitter/LinkedIn

### Post-Launch (Ongoing)
- [ ] Monitor analytics daily
- [ ] Respond to feedback
- [ ] Weekly cohort analysis
- [ ] Iterate on conversion funnels

---

## 📊 Success Metrics

### Week 1
- [ ] 50 signups
- [ ] 5 providers create profiles
- [ ] At least 1 paid conversion

### Month 1
- [ ] 200 signups
- [ ] 20 paid users ($500 MRR)
- [ ] 5% free-to-paid conversion

### Month 3
- [ ] 500 signups
- [ ] 50 paid users ($1,500 MRR)
- [ ] 10% free-to-paid conversion
- [ ] Organic search traffic

### Month 6
- [ ] 1,000 signups
- [ ] 100 paid users ($3,000 MRR)
- [ ] Profitable unit economics (CAC < 3x LTV)

---

## ⚠️ Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| **Free users never convert** | Aggressive upgrade prompts, time-limited free tier (30 days?) |
| **Competitors copy pricing** | Focus on UX, speed, automation - not just price |
| **Low provider quality** | Google 4+ star filter, add user reviews |
| **Support burden from free users** | Self-service docs, chatbot, community forum |

---

## Next Immediate Steps

1. ✅ **Commit code:** Already done
2. **Update Stripe pricing:** Create 24 price IDs (4 roles × 6 currencies)
3. **Get Google Places API key:** console.cloud.google.com
4. **Deploy:** `git push origin main`
5. **Test:** Full end-to-end signup → subscribe flow
6. **Launch:** Reddit, Product Hunt, Twitter

**You're ready to ship! 🚀**

---

## 🔧 Development Notes

### Virtual Environment Best Practice

**⚠️ CRITICAL REMINDER FOR FUTURE MVPS:**

ALWAYS activate virtual environment BEFORE installing any Python packages:

```bash
# Check if virtual environment is active
echo $VIRTUAL_ENV

# If empty, activate it first:
source venv/bin/activate

# Verify you're in venv:
which python  # Should show: /path/to/project/venv/bin/python

# NOW you can safely install packages:
pip install package-name

# Save to requirements:
pip freeze > requirements.txt
```

**Why this matters:**
- Prevents packages from being installed system-wide
- Ensures consistent dependencies across environments
- Avoids cleanup work later (like we just did!)

**Session Handoff System:**
- See `.claude/SESSION_HANDOFF.md` for clean context management
- Clear and restart sessions between features for better code quality
