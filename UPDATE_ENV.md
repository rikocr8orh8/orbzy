# Update Environment Variables

## Copy this template and fill in YOUR values:

Open: `/home/elyas/Maintenance Scheduler (DOE)/orbsphere/.env.local`

Replace the entire file with this (filled in with your actual values):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://kwkzjrzkcicsdzlhqzia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=paste-your-service-role-key-here
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.kwkzjrzkcicsdzlhqzia.supabase.co:5432/postgres

# Brevo (formerly Sendinblue)
BREVO_API_KEY=paste-your-new-brevo-key-here
BREVO_FROM_EMAIL=your-verified-email@domain.com
BREVO_FROM_NAME=ORBSPHERE

# Stripe (TEST MODE - leave as-is for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎯 Where to Find Each Value:

### Supabase Values:

**1. NEXT_PUBLIC_SUPABASE_URL:**
- Already visible: `https://kwkzjrzkcicsdzlhqzia.supabase.co`

**2. NEXT_PUBLIC_SUPABASE_ANON_KEY:**
- Go to: Settings → API
- Copy the **anon public** key (starts with `eyJ...`)

**3. SUPABASE_SERVICE_ROLE_KEY:**
- Same page (Settings → API)
- Copy the **service_role** key (starts with `eyJ...`)

**4. DATABASE_URL:**
- You're already viewing it!
- Copy: `postgresql://postgres:[YOUR-PASSWORD]@db.kwkzjrzkcicsdzlhqzia.supabase.co:5432/postgres`
- Replace `[YOUR-PASSWORD]` with your actual database password

---

### Brevo Values:

**1. BREVO_API_KEY:**
- Generate new key in Brevo dashboard
- Copy the full key (starts with `xkeysib-`)

**2. BREVO_FROM_EMAIL:**
- Go to Brevo → Senders, domains, IPs
- Add a sender email
- Verify it (check your email inbox)
- Use that verified email here

**3. BREVO_FROM_NAME:**
- Just use: `ORBSPHERE`

---

## ✅ Quick Steps:

1. [ ] Get Supabase anon key (Settings → API)
2. [ ] Get Supabase service_role key (Settings → API)
3. [ ] Get your database password (you created this when setting up Supabase)
4. [ ] Generate new Brevo API key
5. [ ] Set up sender email in Brevo
6. [ ] Verify sender email (check inbox)
7. [ ] Update `.env.local` with all values
8. [ ] Save the file

---

## 🚀 After Updating .env.local:

Run these commands:

```bash
cd "/home/elyas/Maintenance Scheduler (DOE)/orbsphere"

# Push database schema
npm run prisma:push

# Seed sample providers
npm run seed

# Start dev server
npm run dev
```

Then open: http://localhost:3000

---

**Let me know when you have the credentials ready and I'll help you update the file!**
