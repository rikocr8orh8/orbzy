# Brevo Email Setup Guide

## What is Brevo?

Brevo (formerly Sendinblue) is an email service provider. The ORBSPHERE app uses it to send:
- Booking confirmations to customers
- New booking notifications to service providers

## Free Tier Benefits

- ✅ **300 emails per day** (free forever)
- ✅ No credit card required to start
- ✅ Easy API integration
- ✅ Better deliverability than SendGrid

---

## Step-by-Step Setup (5 minutes)

### Step 1: Create Brevo Account

1. Go to https://www.brevo.com
2. Click "Sign up free"
3. Fill out the form:
   - Email (use your work email)
   - Password
   - Company name (can use "ORBSPHERE" or your name)
4. Verify your email address

### Step 2: Get Your API Key

1. Log in to Brevo dashboard
2. Click your name (top right) → **SMTP & API**
3. Scroll to "API Keys" section
4. Click **"Create a new API key"**
5. Name it: `orbsphere-dev`
6. Click "Generate"
7. **COPY THE KEY** (you won't see it again!)
   - It looks like: `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx`

### Step 3: Set Up Sender Email

1. In Brevo dashboard, go to **Senders, Domains & Dedicated IPs**
2. Click **"Add a sender"**
3. Enter:
   - **Email**: Your email address (e.g., `you@gmail.com`)
   - **Sender name**: `ORBSPHERE`
4. Click "Add"
5. **Check your email** and verify the sender address

> **Important**: You can only send emails FROM the verified email address!

### Step 4: Update Environment Variables

Open: `/home/elyas/Maintenance Scheduler (DOE)/orbsphere/.env.local`

Update these lines:

```env
# Brevo (formerly Sendinblue)
BREVO_API_KEY=xkeysib-your-actual-key-here-xxxxxxxxxxxxxx
BREVO_FROM_EMAIL=your-verified@email.com
BREVO_FROM_NAME=ORBSPHERE
```

**Example:**
```env
BREVO_API_KEY=xkeysib-abc123def456ghi789jkl012mno345pqr678stu901
BREVO_FROM_EMAIL=john@gmail.com
BREVO_FROM_NAME=ORBSPHERE
```

### Step 5: Restart Your Dev Server

If the server is running:

```bash
# Press Ctrl+C to stop
npm run dev
```

---

## Testing Email Sending

### Test 1: Create a Booking

1. Go to http://localhost:3000
2. Sign up / log in
3. Create a task
4. Book a provider
5. **Check your email inbox!**

You should receive:
- Booking confirmation email
- Provider gets a notification

### Test 2: Check Brevo Dashboard

1. Go to Brevo dashboard
2. Click **Transactional** → **Statistics**
3. You should see your sent emails

---

## Email Template Preview

### User Confirmation Email

**Subject:** Booking Confirmation - Quick Plumbing

**Content:**
```
Your appointment is booked!

Provider: Quick Plumbing
Date: January 15, 2026
Task: HVAC Maintenance
Category: HVAC

We've sent the details to hello@quickplumbing.com

Thank you for using ORBSPHERE!
```

### Provider Notification Email

**Subject:** New Booking Request - HVAC Maintenance

**Content:**
```
You have a new booking request

Customer: John Doe
Email: john@example.com
Date: January 15, 2026
Task: HVAC Maintenance
Category: HVAC
Address: Not provided
Notes: None

Please contact the customer to confirm the appointment details.
```

---

## Troubleshooting

### "Email not sending"

1. **Check API Key**
   - Make sure it starts with `xkeysib-`
   - Verify it's correctly pasted (no spaces)

2. **Check Sender Email**
   - Must be verified in Brevo
   - Must match `BREVO_FROM_EMAIL` exactly

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for error messages

4. **Check Server Logs**
   - Look at your terminal for errors
   - "Email sending failed" will show details

### "Sender email not verified"

1. Go to Brevo dashboard
2. **Senders, Domains & Dedicated IPs**
3. Check if your email has a ✓ (verified)
4. If not, click "Resend verification email"

### "Daily limit reached"

Free tier = 300 emails/day

- Check Brevo dashboard for usage
- Emails reset daily at midnight UTC
- Upgrade if you need more (€25/month for 20k emails)

---

## Advanced: Custom Domain (Optional)

For production, use a custom domain:

1. Buy a domain (e.g., `orbsphere.com`)
2. In Brevo: **Senders, Domains & Dedicated IPs** → **Domains**
3. Add your domain and follow DNS instructions
4. Use: `noreply@orbsphere.com`

Benefits:
- More professional
- Better deliverability
- No "via brevo.com" in email headers

---

## Brevo vs SendGrid

| Feature | Brevo FREE | SendGrid FREE |
|---------|-----------|---------------|
| Daily emails | 300 | 100 |
| Credit card | Not required | Required |
| API docs | Excellent | Good |
| Deliverability | Great | Great |
| Support | Email | Email |

**Winner: Brevo** for small apps!

---

## Production Checklist

Before deploying:

- [ ] Verified sender email
- [ ] API key added to Vercel env vars
- [ ] Test emails sending correctly
- [ ] Monitor daily usage
- [ ] Consider custom domain

---

## API Rate Limits

- **300 emails/day** (free tier)
- **10 emails per API call**
- No rate limit on API calls

For this MVP:
- Each booking = 2 emails (user + provider)
- 300 emails = ~150 bookings per day
- Plenty for early testing!

---

## Need Help?

- Brevo Docs: https://developers.brevo.com/
- Brevo Support: support@brevo.com
- Check Brevo status: https://status.brevo.com/

---

**🎉 Once set up, emails will automatically send on every booking!**
