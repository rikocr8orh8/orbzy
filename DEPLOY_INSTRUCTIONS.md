# Deploy Orbzy to Vercel - Quick Start Guide

## ✅ Your Code is Ready!

Everything is committed to git and ready to deploy. Follow these steps:

---

## Step 1: Push to GitHub (5 minutes)

### Create GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `orbzy` (or whatever you prefer)
3. **Important:** Leave all checkboxes UNCHECKED (don't add README, .gitignore, or license)
4. Click **"Create repository"**

### Push Your Code

GitHub will show you commands. Copy and run these in your terminal:

```bash
cd "/home/elyas/Maintenance Scheduler (DOE)/orbsphere"
git remote add origin https://github.com/YOUR-USERNAME/orbzy.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

---

## Step 2: Deploy to Vercel (3 minutes)

### Connect GitHub to Vercel

1. Go to **https://vercel.com/new**
2. Click **"Continue with GitHub"** (or sign up if you don't have an account)
3. Authorize Vercel to access your GitHub repositories
4. Select **"Import Git Repository"**
5. Find your `orbzy` repository and click **"Import"**

### Configure Project

Vercel will auto-detect Next.js. You don't need to change any build settings.

Click **"Deploy"** and Vercel will start building your app!

---

## Step 3: Set Up Database (5 minutes)

### Option A: Neon (Recommended - Free & Easy)

1. Go to **https://console.neon.tech/**
2. Sign up with GitHub
3. Create a new project: **"orbzy-db"**
4. Copy the **Connection String** (starts with `postgresql://`)

### Option B: Vercel Postgres

1. In Vercel dashboard, go to your project
2. Click **"Storage"** tab
3. Click **"Create Database"** → **"Postgres"**
4. Copy the `DATABASE_URL` from environment variables

---

## Step 4: Add Environment Variables (3 minutes)

In Vercel dashboard:

1. Go to your project → **"Settings"** → **"Environment Variables"**
2. Add these variables:

### Required Variables:

**DATABASE_URL**
```
postgresql://username:password@host/database?sslmode=require
```
(Paste your Neon or Vercel Postgres connection string)

**NEXTAUTH_URL**
```
https://your-app-name.vercel.app
```
(Use your actual Vercel URL - you'll see it after first deployment)

**NEXTAUTH_SECRET**
```bash
# Generate a secure secret by running this in terminal:
openssl rand -base64 32
# Then paste the output here
```

**BREVO_API_KEY**
```
xkeysib-your-api-key-here
```
(Get from https://app.brevo.com/settings/keys/api)

**BREVO_SENDER_EMAIL**
```
noreply@yourdomain.com
```
(Must be verified in Brevo)

**BREVO_SENDER_NAME**
```
Orbzy
```

**NODE_ENV**
```
production
```

3. Click **"Save"**
4. Go to **"Deployments"** tab
5. Click **"Redeploy"** (with environment variables now set)

---

## Step 5: Initialize Database (2 minutes)

### Option A: Using Vercel CLI (Easiest)

Install Vercel CLI:
```bash
npm install -g vercel
```

Login and link project:
```bash
cd "/home/elyas/Maintenance Scheduler (DOE)/orbsphere"
vercel login
vercel link
```

Run database migration:
```bash
vercel env pull .env.local  # Download environment variables
npx prisma db push          # Push database schema
npm run seed:providers      # Seed provider data
```

### Option B: Manual Database Setup

1. Connect to your database using any PostgreSQL client (like pgAdmin or TablePlus)
2. Copy the SQL from `setup-database.sql`
3. Run it manually in your database client

---

## Step 6: Verify Deployment ✅

Visit your Vercel URL (e.g., `https://orbzy.vercel.app`) and test:

### Landing Page
- [ ] Page loads with purple gradient background
- [ ] "🎉 FREE Private Beta" badge visible
- [ ] "Get Started" button works

### Sign Up
- [ ] Click "Get Started"
- [ ] Fill out signup form
- [ ] Submit and check for "Check Your Email!" message

### Email Verification
- [ ] Check your email inbox
- [ ] Click verification link
- [ ] Should redirect to login with success message

### Login & Dashboard
- [ ] Login with verified credentials
- [ ] Dashboard loads with "You're an Early Adopter!" badge
- [ ] No payment buttons visible

### Create Task
- [ ] Create a maintenance task
- [ ] Providers appear sorted by category

### Book Provider
- [ ] Click on a provider
- [ ] Booking modal opens
- [ ] Can schedule appointment

---

## Step 7: Custom Domain (Optional)

To use your own domain:

1. In Vercel dashboard → **"Settings"** → **"Domains"**
2. Add your domain (e.g., `orbzy.com`)
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` to your custom domain

---

## Troubleshooting

### Build Fails

Check Vercel deployment logs:
- Go to **"Deployments"** tab
- Click on failed deployment
- View build logs

Common issues:
- Missing environment variables
- Database connection failed
- Node version mismatch

### Database Connection Errors

1. Verify `DATABASE_URL` is correct
2. Check database is accessible (not behind firewall)
3. Ensure SSL mode is enabled: `?sslmode=require`

### Email Not Sending

1. Verify Brevo API key is valid
2. Check sender email is verified in Brevo
3. Check Vercel function logs for errors

### App Loads but Features Don't Work

1. Check environment variables are set correctly
2. Run database migrations: `npx prisma db push`
3. Seed providers: `npm run seed:providers`

---

## Updating Your App

After making code changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically redeploy (takes ~2 minutes).

---

## Vercel Free Tier Limits

Your app falls well within free tier:

- **Bandwidth:** 100 GB/month (enough for 10,000+ visitors)
- **Serverless Function Execution:** 100 GB-hours/month
- **Build Minutes:** Unlimited for hobby projects
- **Deployments:** Unlimited

For private beta with 10-50 users, you'll use **~1-5% of free tier limits**.

---

## Environment Variables Quick Reference

```bash
# Copy this template and fill in your values

# Database
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Auth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email (Brevo)
BREVO_API_KEY="xkeysib-your-key"
BREVO_SENDER_EMAIL="noreply@yourdomain.com"
BREVO_SENDER_NAME="Orbzy"

# Environment
NODE_ENV="production"
```

---

## Next Steps After Deployment

### Immediate (Day 1)
- [ ] Test all features thoroughly
- [ ] Invite 5-10 trusted friends/family
- [ ] Monitor Vercel logs for errors

### Week 1
- [ ] Collect initial feedback
- [ ] Fix any critical bugs
- [ ] Invite 20-30 more beta users

### Week 2-4
- [ ] Iterate based on feedback
- [ ] Monitor usage patterns
- [ ] Prepare for wider beta

### Week 8-10
- [ ] Plan public launch
- [ ] Re-enable payments (see BETA_LAUNCH.md)
- [ ] Set up custom domain

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Discord:** https://vercel.com/discord
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Neon Docs:** https://neon.tech/docs/introduction
- **Prisma Docs:** https://www.prisma.io/docs/

---

## 🚀 Quick Deploy Checklist

Use this to deploy in ~15 minutes:

1. [ ] Push code to GitHub
2. [ ] Import to Vercel from GitHub
3. [ ] Create Neon database (or Vercel Postgres)
4. [ ] Add 7 environment variables in Vercel
5. [ ] Redeploy with environment variables
6. [ ] Run `npx prisma db push` and `npm run seed:providers`
7. [ ] Test signup → verification → login → dashboard
8. [ ] Invite first beta users!

---

## Your App Info

**Git Commit:** f97c9df
**Build Status:** ✅ Passing
**Framework:** Next.js 14.2.35
**Database:** PostgreSQL (via Prisma)
**Email:** Brevo API
**Deployment:** Ready for Vercel

---

**Ready to launch?** Follow Step 1 above to push to GitHub, then Step 2 to deploy to Vercel!

🎉 Your private beta is ready to go live!
