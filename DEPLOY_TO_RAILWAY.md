# Deploy Orbzy to Railway - Step by Step Guide

## ✅ Your App is Ready to Deploy!

All changes have been committed to git. Here's how to deploy to Railway:

---

## Option 1: Deploy via GitHub (RECOMMENDED - Easiest)

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (name it "orbzy" or "orbsphere")
3. **DO NOT** initialize with README, .gitignore, or license (your repo already has these)
4. Click "Create repository"

### Step 2: Push Your Code to GitHub

GitHub will show you commands. Use these:

```bash
cd "/home/elyas/Maintenance Scheduler (DOE)/orbsphere"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and repository name.

### Step 3: Deploy on Railway

1. Go to https://railway.app/
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select your `orbzy` repository
6. Railway will automatically detect it's a Next.js app

### Step 4: Add Environment Variables

In Railway dashboard, go to your project → Variables tab and add:

```bash
# Database (Railway will provide this automatically)
DATABASE_URL=postgresql://...  # Railway Postgres plugin will set this

# NextAuth
NEXTAUTH_URL=https://your-app-name.up.railway.app
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32

# Email (Brevo)
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=your-verified-sender@example.com
BREVO_SENDER_NAME=Orbzy

# Node
NODE_ENV=production
```

### Step 5: Add PostgreSQL Database

1. In Railway dashboard, click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically set `DATABASE_URL` environment variable
3. Your app will connect automatically

### Step 6: Run Database Migration

In Railway dashboard → your service → "Deploy" tab:

1. Click "Settings"
2. Scroll to "Deploy"
3. Add a custom start command or use Railway's built-in migration

Or connect via Railway CLI (see Option 2 below) and run:
```bash
railway run npx prisma db push
railway run npm run seed:providers
```

### Step 7: Deploy!

Railway will automatically deploy when you push to GitHub. After first deploy:

1. Wait for build to complete (2-5 minutes)
2. Railway will provide a URL: `https://your-app-name.up.railway.app`
3. Visit the URL to see your app live!

---

## Option 2: Deploy via Railway CLI

### Step 1: Install Railway CLI

**Linux/macOS:**
```bash
# Using npm
sudo npm install -g @railway/cli

# OR using curl
curl -fsSL https://railway.app/install.sh | sh
```

**Windows:**
```bash
# Using npm
npm install -g @railway/cli

# OR download from https://railway.app/cli
```

### Step 2: Login to Railway

```bash
railway login
```

This will open a browser window to authenticate.

### Step 3: Initialize Railway Project

```bash
cd "/home/elyas/Maintenance Scheduler (DOE)/orbsphere"
railway init
```

Follow the prompts:
- Select "Create new project"
- Name it "orbzy" or "orbsphere"

### Step 4: Add PostgreSQL

```bash
railway add --plugin postgresql
```

### Step 5: Set Environment Variables

```bash
railway variables set NEXTAUTH_URL=https://your-app-name.up.railway.app
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set BREVO_API_KEY=your-brevo-api-key
railway variables set BREVO_SENDER_EMAIL=your-email@example.com
railway variables set BREVO_SENDER_NAME=Orbzy
railway variables set NODE_ENV=production
```

### Step 6: Run Database Migrations

```bash
railway run npx prisma db push
railway run npm run seed:providers
```

### Step 7: Deploy!

```bash
railway up
```

Railway will:
1. Build your Next.js app
2. Deploy to production
3. Provide a public URL

---

## Post-Deployment Checklist

After deploying, verify these work:

### 1. Test User Signup
- [ ] Visit your Railway URL
- [ ] Click "Get Started"
- [ ] Create a test account
- [ ] Check email for verification link

### 2. Test Email Verification
- [ ] Click verification link in email
- [ ] Should redirect to login with success message

### 3. Test Login
- [ ] Log in with verified account
- [ ] Should redirect to dashboard

### 4. Test Dashboard
- [ ] Dashboard loads correctly
- [ ] "FREE PRIVATE BETA" badge shows
- [ ] No payment buttons visible

### 5. Test Task Creation
- [ ] Create a maintenance task
- [ ] Providers should appear sorted by category

### 6. Test Booking
- [ ] Click on a provider
- [ ] Booking modal should open
- [ ] Complete a booking

---

## Environment Variables Reference

Here's what each variable does:

### Required Variables:

**DATABASE_URL** - PostgreSQL connection string
- Automatically set by Railway Postgres plugin
- Format: `postgresql://user:password@host:port/database`

**NEXTAUTH_URL** - Your app's public URL
- Use your Railway URL: `https://your-app-name.up.railway.app`
- Required for authentication to work

**NEXTAUTH_SECRET** - Secret key for session encryption
- Generate with: `openssl rand -base64 32`
- Keep this secret and secure

**BREVO_API_KEY** - Brevo (formerly Sendinblue) API key
- Get from: https://app.brevo.com/settings/keys/api
- Used for sending verification emails

**BREVO_SENDER_EMAIL** - Email address to send from
- Must be verified in Brevo
- Example: `noreply@yourdomain.com`

**BREVO_SENDER_NAME** - Name shown in emails
- Example: `Orbzy`

### Optional Variables:

**NODE_ENV** - Environment mode
- Set to `production` for production deployments
- Railway sets this automatically

---

## Updating Your Deployment

After making code changes:

### If using GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
Railway will automatically redeploy.

### If using Railway CLI:
```bash
railway up
```

---

## Troubleshooting

### Build Fails
- Check Railway logs in dashboard → "Deployments" tab
- Common issues:
  - Missing environment variables
  - Database not connected
  - Node version mismatch

### Database Connection Errors
- Verify `DATABASE_URL` is set
- Run migrations: `railway run npx prisma db push`
- Check PostgreSQL plugin is running

### Email Verification Not Working
- Verify Brevo API key is correct
- Check sender email is verified in Brevo
- Check Railway logs for email sending errors

### App Not Loading
- Check Railway logs for errors
- Verify all environment variables are set
- Ensure build completed successfully

---

## Railway Dashboard URLs

- **Dashboard**: https://railway.app/dashboard
- **Project Settings**: https://railway.app/project/YOUR-PROJECT-ID
- **Deployments**: https://railway.app/project/YOUR-PROJECT-ID/deployments
- **Environment Variables**: https://railway.app/project/YOUR-PROJECT-ID/variables

---

## Cost Estimate

Railway free tier includes:
- $5 of usage credit per month
- Enough for private beta testing (10-50 users)

Estimated costs for beta:
- Next.js app: ~$0.50-$2/month
- PostgreSQL: ~$1-$3/month
- Total: **~$1.50-$5/month** (within free tier)

For public launch with more users, expect ~$10-$20/month.

---

## Next Steps After Deployment

1. **Invite Beta Users**
   - Share your Railway URL
   - Use template from [PRIVATE_BETA_READY.md](PRIVATE_BETA_READY.md)

2. **Monitor Performance**
   - Check Railway logs daily
   - Watch for errors
   - Track user signups

3. **Collect Feedback**
   - Email beta users weekly
   - Ask for bug reports
   - Gather feature requests

4. **Iterate Quickly**
   - Fix bugs within 24-48 hours
   - Push updates frequently
   - Keep beta users informed

---

## Support

If you encounter issues:

1. **Check Railway Logs**
   - Dashboard → Your Project → Deployments → Click deployment → View Logs

2. **Railway Community**
   - Discord: https://discord.gg/railway
   - Forum: https://help.railway.app

3. **Documentation**
   - Railway Docs: https://docs.railway.app
   - Next.js Deployment: https://nextjs.org/docs/deployment

---

## 🎉 You're Ready!

Your Orbzy MVP is configured and ready to deploy to Railway!

**Quick Deploy Commands:**

```bash
# If using GitHub (after pushing to GitHub)
# Just connect Railway to your GitHub repo in the Railway dashboard

# If using Railway CLI
railway login
railway init
railway add --plugin postgresql
railway variables set NEXTAUTH_URL=your-url
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway run npx prisma db push
railway run npm run seed:providers
railway up
```

Good luck with your private beta launch! 🚀

---

**Last Updated:** 2026-01-07
**Status:** ✅ Ready to Deploy
**Git Commit:** eb79127
