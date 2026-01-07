# ORBSPHERE - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (1 min)

```bash
cd orbsphere
npm install
```

### Step 2: Set Up Supabase (2 min)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose a name, database password, and region
4. Wait for the project to be created
5. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key
6. Go to **Settings** → **Database** and copy the connection string

### Step 3: Configure Environment (1 min)

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres
```

For now, you can leave SendGrid and Stripe as-is (they're optional for testing).

### Step 4: Set Up Database (1 min)

```bash
npm run prisma:push
npm run seed
```

### Step 5: Run the App! (30 sec)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Test the App

1. Click "Get Started Free"
2. Create an account with any email (e.g., test@example.com)
3. Create a maintenance task
4. Book a provider
5. Mark task as complete

## 🎯 What Works Without Additional Setup

- ✅ User authentication (via Supabase)
- ✅ Task creation and management
- ✅ Provider browsing
- ✅ Booking flow
- ✅ Task completion

## 📧 To Enable Email Notifications

1. Sign up at [SendGrid](https://sendgrid.com) (free tier: 100 emails/day)
2. Create an API key with "Mail Send" permission
3. Verify a sender email address
4. Add to `.env.local`:

```env
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=your-verified-email@domain.com
```

## 💳 To Enable Stripe Payments

1. Sign up at [Stripe](https://stripe.com)
2. Get your test API keys from the Dashboard
3. Add to `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

4. Create a payment link in Stripe Dashboard
5. Update the links in `src/app/page.tsx` and `src/app/dashboard/page.tsx`

## 🚢 Deploy to Vercel (2 min)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (copy from `.env.local`)
5. Click Deploy!

## 🆘 Common Issues

**"Error: Prisma Client not found"**
```bash
npm run prisma:push
```

**"Authentication error"**
- Check your Supabase URL and keys are correct
- Make sure you copied the full keys (they're long!)

**"Database connection failed"**
- Verify your DATABASE_URL password is correct
- Check your IP isn't blocked in Supabase

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Customize the UI in the components
- Add more provider categories
- Set up production environment variables
- Enable Row Level Security in Supabase

## 💡 Pro Tips

1. Use `npm run prisma:studio` to view/edit database directly
2. Check browser console for helpful error messages
3. Supabase has built-in auth UI you can use instead
4. Keep your `.env.local` file secret (it's in `.gitignore`)

---

Need help? Check the troubleshooting section in the main README!
