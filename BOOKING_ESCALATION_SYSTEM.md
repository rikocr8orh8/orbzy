# Orbzy Booking Escalation System
## Automatic Provider Fallback & 24-Hour Confirmation Guarantee

---

## Overview

The booking escalation system ensures users **always get service** by automatically connecting them with backup providers if the primary provider doesn't respond within 24 hours.

---

## How It Works

### User Books a Service

```
User selects HVAC → 3 providers shown
         ↓
User clicks provider → BookingModal opens
         ↓
Modal shows:
  - Primary provider (#1)
  - 2 backup providers (#2, #3)
  - 24-hour guarantee badge
         ↓
User confirms booking
```

### Automatic Escalation Flow

```
Booking created with 24-hour deadline
         ↓
Email sent to provider #1
         ↓
[Wait 24 hours]
         ↓
   Provider responds?
    ↙         ↘
  YES         NO
   ↓           ↓
Confirmed   Escalate to #2
(DONE)         ↓
        Email sent to provider #2
               ↓
        [Wait 24 hours]
               ↓
          Provider responds?
           ↙         ↘
         YES         NO
          ↓           ↓
       Confirmed   Escalate to #3
       (DONE)         ↓
               Email sent to provider #3
                      ↓
               [Wait 24 hours]
                      ↓
                 Provider responds?
                  ↙         ↘
                YES         NO
                 ↓           ↓
              Confirmed   Status: FAILED
              (DONE)         ↓
                      Show custom quote form
                      "We couldn't reach providers.
                       Submit a request for quotes."
```

---

## Database Schema

### Booking Model Fields

```typescript
model Booking {
  id            String    @id @default(cuid())

  // Core booking info
  taskId        String
  userId        String
  providerId    String    // Current provider being contacted
  scheduledDate DateTime
  notes         String?

  // Escalation fields
  backupProviderIds String[] @default([])  // [provider2_id, provider3_id]
  currentProviderIndex Int @default(0)     // 0 = trying first backup, 1 = second, etc.
  escalationAttempts Int @default(0)       // How many times we've escalated
  lastEscalatedAt DateTime?                // When we last escalated
  providerResponseDeadline DateTime?       // 24 hours from booking/escalation

  // Status tracking
  status String @default("pending")        // pending | confirmed | escalated | failed | completed

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Status Values

- **pending**: Waiting for primary provider to respond (first 24 hours)
- **escalated**: Escalated to backup provider, waiting for response
- **confirmed**: Provider confirmed the booking
- **failed**: All providers exhausted, user needs custom quote
- **completed**: Service was delivered successfully

---

## API Routes

### 1. Create Booking with Escalation Support

**Endpoint**: `POST /api/bookings`

**Request Body**:
```json
{
  "taskId": "clx123...",
  "providerId": "provider1_id",
  "scheduledDate": "2026-01-15",
  "notes": "Need AC tune-up before summer",
  "backupProviderIds": ["provider2_id", "provider3_id"]
}
```

**What It Does**:
1. Creates booking with primary provider
2. Stores backup provider IDs
3. Sets 24-hour response deadline
4. Sends email to primary provider
5. Sends confirmation email to user

---

### 2. Manual Escalation

**Endpoint**: `POST /api/bookings/escalate`

**Request Body**:
```json
{
  "bookingId": "clx123..."
}
```

**Response** (Success):
```json
{
  "message": "Booking escalated to next provider",
  "booking": { ... },
  "escalationAttempt": 1,
  "newProvider": {
    "id": "provider2_id",
    "name": "Stan's HVAC",
    "rating": 4.8
  }
}
```

**Response** (All Providers Exhausted):
```json
{
  "message": "All providers exhausted",
  "fallbackToQuote": true,
  "booking": { "status": "failed", ... }
}
```

---

### 3. Auto-Escalation Check (Internal)

**Endpoint**: `GET /api/bookings/escalate`

**What It Does**:
1. Finds all bookings with `status IN ('pending', 'escalated')`
2. Filters by `providerResponseDeadline <= NOW()`
3. For each overdue booking:
   - If backups remaining → escalate to next provider
   - If no backups → mark as `failed`
4. Sends email notifications

**Response**:
```json
{
  "message": "Auto-escalation completed",
  "processed": 3,
  "results": [
    { "bookingId": "clx1", "action": "escalated", "message": "Escalated to provider 2" },
    { "bookingId": "clx2", "action": "failed", "message": "All providers exhausted" },
    { "bookingId": "clx3", "action": "escalated", "message": "Escalated to provider 1" }
  ]
}
```

---

### 4. Cron Job Trigger

**Endpoint**: `GET /api/cron/escalate-bookings`

**Headers**:
```
Authorization: Bearer {CRON_SECRET}
```

**What It Does**:
- Calls the auto-escalation endpoint
- Returns execution results
- Runs every hour via Vercel Cron

**Vercel Cron Config** (vercel.json):
```json
{
  "crons": [{
    "path": "/api/cron/escalate-bookings",
    "schedule": "0 * * * *"
  }]
}
```

---

## UI Components

### BookingModal.tsx

**Features**:
1. Shows primary provider with rating/address
2. Displays "24-Hour Confirmation Guarantee" badge
3. Lists backup providers (#2, #3) in preview section
4. Auto-selects 2 backup providers from same category
5. Sends all 3 provider IDs to backend

**User Experience**:
```
┌─────────────────────────────────────┐
│ Book ABC Home & Commercial Services │
├─────────────────────────────────────┤
│ 📍 Primary Provider                 │
│ ABC Home & Commercial               │
│ HVAC • ⭐ 4.7                       │
│ 7608 E. Interstate 35, Austin       │
├─────────────────────────────────────┤
│ ⏰ 24-Hour Confirmation Guarantee   │
│ ABC Home has 24 hours to confirm.   │
│ If they don't respond, we'll        │
│ automatically connect you with      │
│ backup providers.                   │
├─────────────────────────────────────┤
│ 🛡️ Backup Providers (if needed):   │
│ #2 Stan's HVAC • ⭐ 4.8            │
│ #3 Fox Service • ⭐ 4.6            │
├─────────────────────────────────────┤
│ Preferred Date: [2026-01-15]        │
│ Special Notes: [text area]          │
├─────────────────────────────────────┤
│ [Confirm Booking] [Cancel]          │
└─────────────────────────────────────┘
```

---

## Email Notifications

### To User (Booking Confirmation)

```
Subject: Booking Confirmation - ABC Home & Commercial Services

Your appointment is booked!

Provider: ABC Home & Commercial Services
Date: January 15, 2026
Task: HVAC - AC Pre-Summer Tune-up
Category: HVAC

⏰ 24-Hour Confirmation Window
ABC Home & Commercial Services has 24 hours to confirm.
If they don't respond, we'll automatically reach out to
our backup providers to ensure you get service.

Thank you for using Orbzy!
```

### To Provider (Booking Request)

```
Subject: New Booking Request - HVAC Maintenance

You have a new booking request

Customer: John Doe
Email: john@example.com
Date: January 15, 2026
Task: HVAC - AC Pre-Summer Tune-up
Category: HVAC
Address: 123 Main St, Austin, TX
Notes: Need tune-up before summer heat

⚠️ URGENT: Please respond within 24 hours
To confirm this booking, please contact the customer
directly within 24 hours. If we don't hear from you,
the booking will be automatically assigned to another
provider.
```

### To User (Escalation Notice - TODO)

```
Subject: Update on Your Booking - New Provider Assigned

We're still working to get you service!

Original Provider: ABC Home & Commercial (no response)
New Provider: Stan's HVAC ⭐ 4.8

We've contacted Stan's HVAC on your behalf. They have
24 hours to confirm. We'll keep you updated!

Your appointment: January 15, 2026
```

---

## Cron Job Setup

### Option 1: Vercel Cron (Recommended)

Already configured in `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/escalate-bookings",
    "schedule": "0 * * * *"
  }]
}
```

Runs automatically on Vercel every hour.

### Option 2: Railway Cron

Add to Railway project:
```bash
# In Railway dashboard, add cron job:
# Command: curl https://orbzy.app/api/cron/escalate-bookings -H "Authorization: Bearer {CRON_SECRET}"
# Schedule: 0 * * * *
```

### Option 3: External Cron Service (cron-job.org)

1. Create account at cron-job.org
2. Add new cron job:
   - URL: `https://orbzy.app/api/cron/escalate-bookings`
   - Schedule: Every hour
   - Headers: `Authorization: Bearer {CRON_SECRET}`

### Option 4: GitHub Actions

Create `.github/workflows/escalate-bookings.yml`:
```yaml
name: Escalate Bookings
on:
  schedule:
    - cron: '0 * * * *'  # Every hour
jobs:
  escalate:
    runs-on: ubuntu-latest
    steps:
      - name: Call Escalation Endpoint
        run: |
          curl -X GET https://orbzy.app/api/cron/escalate-bookings \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

---

## Testing the Escalation System

### 1. Create Test Booking

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "test_task_id",
    "providerId": "provider1_id",
    "scheduledDate": "2026-01-15",
    "notes": "Test booking",
    "backupProviderIds": ["provider2_id", "provider3_id"]
  }'
```

### 2. Manually Trigger Escalation (for testing)

```bash
curl -X POST http://localhost:3000/api/bookings/escalate \
  -H "Content-Type: application/json" \
  -d '{ "bookingId": "clx123..." }'
```

### 3. Test Cron Job

```bash
curl -X GET http://localhost:3000/api/cron/escalate-bookings \
  -H "Authorization: Bearer orbzy-cron-secret-2026-change-in-production"
```

### 4. Check Database

```bash
npm run prisma:studio
```

Look for bookings with:
- `status = 'escalated'`
- `escalationAttempts > 0`
- `currentProviderIndex > 0`

---

## Environment Variables

Add to `.env` and production:

```env
# NextAuth
NEXTAUTH_URL="https://orbzy.app"
NEXTAUTH_SECRET="change-me-in-production"

# Cron Security
CRON_SECRET="change-me-in-production-strong-secret-2026"

# Brevo (for emails)
BREVO_API_KEY="xkeysib-..."
BREVO_FROM_EMAIL="noreply@orbzy.app"
BREVO_FROM_NAME="Orbzy"
```

---

## Production Checklist

- [ ] Deploy to Vercel/Railway
- [ ] Set `NEXTAUTH_URL` to `https://orbzy.app`
- [ ] Set strong `CRON_SECRET` in production env
- [ ] Enable Vercel Cron (automatic with vercel.json)
- [ ] Test escalation with real bookings
- [ ] Monitor cron job execution in Vercel logs
- [ ] Set up escalation email templates in Brevo
- [ ] Add user-facing "Booking Status" page
- [ ] Create provider confirmation portal

---

## Future Enhancements

1. **Real-time Notifications**: Use WebSockets to notify users of escalations
2. **Provider Confirmation Portal**: Allow providers to confirm/decline via link
3. **Smart Provider Selection**: Use AI to select best backup based on availability
4. **Custom Quote Requests**: Form for users when all providers fail
5. **SMS Notifications**: Send SMS to providers for urgent bookings
6. **Analytics Dashboard**: Track escalation rates per provider

---

## Support

If a booking fails after all escalations:
1. Status is set to `failed`
2. User sees custom quote request form
3. Admin is notified to manually intervene
4. User receives email with alternative options

This ensures **no user is left without service options**.
