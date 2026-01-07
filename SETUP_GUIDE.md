# ORBSPHERE - Your Personal Setup Guide

## 🎯 Setup Steps for Your Environment

### Current Status:
- ✅ All code files created
- ⏳ npm install running...
- ⏳ Need Supabase credentials
- ✅ Stripe will be in TEST MODE (sandbox)

---

## Step 1: Complete npm install

Wait for the installation to finish (running in background)...

---

## Step 2: Set Up Supabase (FREE - 2 minutes)

### 2.1 Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (recommended)

### 2.2 Create New Project
1. Click "New Project"
2. Choose:
   - **Organization**: Your name or "Personal"
   - **Name**: `orbsphere` or `orbsphere-dev`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait 2-3 minutes for setup

### 2.3 Get Your Credentials

Once ready, go to **Settings** (left sidebar) → **API**:

Copy these 3 values:
```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Go to **Settings** → **Database**:

Scroll to "Connection string" → Click "URI" tab:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

Replace `[YOUR-PASSWORD]` with the password you created in step 2.2

---

## Step 3: Update .env.local

Open the file: `/home/elyas/Maintenance Scheduler (DOE)/orbsphere/.env.local`

Replace these lines with your Supabase credentials:

```env
# Supabase (REPLACE WITH YOUR VALUES)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres

# SendGrid (OPTIONAL - Leave as-is for now)
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@orbsphere.app

# Stripe TEST MODE (OPTIONAL - Leave as-is for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 4: Set Up Database

Once npm install finishes, run:

```bash
cd "/home/elyas/Maintenance Scheduler (DOE)/orbsphere"
npm run prisma:push
```

This will:
- Create all database tables
- Set up relationships
- Prepare the schema

Then seed with sample providers:

```bash
npm run seed
```

This adds 5 sample service providers to test with.

---

## Step 5: Run the App!

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## Step 6: Test the MVP

### 6.1 Create Account
1. Click "Get Started Free"
2. Use any email (e.g., `test@example.com`)
3. Create a password
4. You'll be redirected to the dashboard

### 6.2 Create a Task
1. Fill out the form:
   - Title: "HVAC Annual Inspection"
   - Category: HVAC
   - Due Date: Pick any future date
2. Click "Create Task"

### 6.3 Book a Provider
1. You'll see 3 providers on the right
2. Click "Book Provider" on any one
3. Select a date
4. Add notes (optional)
5. Click "Confirm Booking"

### 6.4 Mark Task Complete
1. Click "Mark Done" on your task
2. It will turn green with a checkmark

---

## 🎉 What Works Right Now

- ✅ User signup/login
- ✅ Task creation and management
- ✅ Provider browsing
- ✅ Booking flow
- ✅ Task completion
- ✅ Database persistence

---

## 🚫 What's NOT Set Up Yet (Optional)

### Email Notifications (Optional)
The booking will work, but emails won't send until you add SendGrid:

1. Sign up at https://sendgrid.com (free: 100 emails/day)
2. Create API key with "Mail Send" permission
3. Verify a sender email
4. Add to `.env.local`:
   ```env
   SENDGRID_API_KEY=SG.xxxxx
   SENDGRID_FROM_EMAIL=your-verified@email.com
   ```
5. Restart dev server

### Stripe Payments (Test Mode - Optional)
Payment links are already in the UI but point to placeholders:

1. Sign up at https://stripe.com
2. Get test keys from Dashboard (toggle "Test mode" ON)
3. Copy "Publishable key" (starts with `pk_test_`)
4. Copy "Secret key" (starts with `sk_test_`)
5. Add to `.env.local`
6. Create a test product:
   - Go to Products → Add Product
   - Name: "ORBSPHERE Pro"
   - Price: $15/month
   - Create a Payment Link
7. Update the link in:
   - `src/app/page.tsx` (line ~65)
   - `src/app/dashboard/page.tsx` (line ~95)

---

## 🐛 Troubleshooting

### "Prisma Client not found"
```bash
npm run prisma:push
```

### "Cannot connect to database"
- Check your DATABASE_URL has the correct password
- Verify Supabase project is active (not paused)

### "Authentication failed"
- Double-check your SUPABASE_URL and keys
- Make sure you copied the full keys (they're very long)

### "Port 3000 already in use"
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9
# Then run again
npm run dev
```

---

## 📊 Database Tools

View/edit your database directly:

```bash
npm run prisma:studio
```

This opens a GUI at http://localhost:5555 where you can:
- See all tables
- Add/edit/delete records
- Inspect relationships

---

## 🎓 Next Steps After Testing

1. **Customize the UI**: Edit components in `src/components/`
2. **Add more categories**: Update `TaskForm.tsx`
3. **Change colors**: Modify `tailwind.config.ts`
4. **Add real providers**: Use Prisma Studio or create a seed script
5. **Deploy**: Push to GitHub, then deploy on Vercel

---

## 🆘 Need Help?

If you get stuck:
1. Check the browser console (F12) for errors
2. Check the terminal for server errors
3. Review the full README.md
4. Verify all environment variables are set correctly

---

## ✅ Quick Checklist

- [ ] npm install completed
- [ ] Created Supabase project
- [ ] Updated .env.local with credentials
- [ ] Ran `npm run prisma:push`
- [ ] Ran `npm run seed`
- [ ] Started dev server with `npm run dev`
- [ ] Tested signup/login
- [ ] Created a task
- [ ] Booked a provider
- [ ] Marked task complete

Once all checked, you have a working MVP! 🎉

---

**Remember**: Stripe is in TEST MODE, so you can safely test without real charges!
