# Your Brevo Setup - Quick Steps

## ✅ Step 1: Copy Your API Key

I can see you already have an API key in Brevo!

**To copy the full key:**

1. In your Brevo dashboard (the screenshot you showed)
2. Click on the API key row (the one ending in `RfaZTz`)
3. Copy the FULL key (it starts with `xkeysib-`)
   - It should look like: `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-RfaZTz`

---

## ✅ Step 2: Set Up Sender Email

You need to verify an email address you'll send FROM.

### In Brevo Dashboard:

1. Click **"Senders, Domains & Dedicated IPs"** (left sidebar)
   - Or go to: https://app.brevo.com/senders/list
2. Click **"Add a sender"**
3. Enter:
   - **Email address**: Your email (e.g., `your-email@gmail.com`)
   - **Sender name**: `ORBSPHERE`
4. Click **"Add"**
5. **Check your email inbox** and click the verification link

> **Important:** You can use any email you own (Gmail, Outlook, Yahoo, etc.)

---

## ✅ Step 3: Update .env.local

Open this file in VS Code:
```
/home/elyas/Maintenance Scheduler (DOE)/orbsphere/.env.local
```

Update these lines with YOUR values:

```env
# Brevo (formerly Sendinblue)
BREVO_API_KEY=xkeysib-paste-your-full-key-here-RfaZTz
BREVO_FROM_EMAIL=your-verified-email@gmail.com
BREVO_FROM_NAME=ORBSPHERE
```

**Example:**
```env
BREVO_API_KEY=xkeysib-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz-RfaZTz
BREVO_FROM_EMAIL=john.doe@gmail.com
BREVO_FROM_NAME=ORBSPHERE
```

---

## ✅ Step 4: What About Supabase?

You also need Supabase credentials. Here's the quick version:

### Create Supabase Project (2 min):

1. Go to: https://supabase.com
2. Sign in with GitHub
3. Click **"New Project"**
4. Fill out:
   - **Name**: `orbsphere` (or `orbsphere-dev`)
   - **Database Password**: Create a strong password **SAVE IT!**
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes...

### Get Credentials:

Once ready:

**Go to Settings → API:**
- Copy **Project URL**: `https://xxxxxxxxx.supabase.co`
- Copy **anon public key**: `eyJhbGc...` (long key)
- Copy **service_role key**: `eyJhbGc...` (another long key)

**Go to Settings → Database:**
- Copy **Connection string** (URI format)
- Replace `[YOUR-PASSWORD]` with the password you created

### Update .env.local:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxx.supabase.co:5432/postgres
```

---

## 🚀 Step 5: Run the Setup Commands

Once you have BOTH Brevo and Supabase configured:

```bash
# Make sure you're in the orbsphere directory
cd "/home/elyas/Maintenance Scheduler (DOE)/orbsphere"

# Check if npm install finished (it might still be running)
# If it's done, run:

# Push database schema to Supabase
npm run prisma:push

# Seed with sample providers
npm run seed

# Start the development server
npm run dev
```

Then open: **http://localhost:3000**

---

## 📧 Step 6: Test Email Sending

1. Open http://localhost:3000
2. Click "Get Started Free"
3. Create account with any email
4. Create a task (e.g., "HVAC Maintenance")
5. Book a provider
6. **Check your email!** You should get a confirmation

---

## 🎯 Quick Checklist

- [ ] Copied full Brevo API key from dashboard
- [ ] Added sender email in Brevo
- [ ] Verified sender email (check inbox)
- [ ] Updated `.env.local` with Brevo credentials
- [ ] Created Supabase project
- [ ] Got Supabase credentials
- [ ] Updated `.env.local` with Supabase credentials
- [ ] Ran `npm run prisma:push`
- [ ] Ran `npm run seed`
- [ ] Started dev server with `npm run dev`
- [ ] Tested booking and received email

---

## 🆘 Need Help?

If you get stuck, let me know and I can help you:
- Find the right settings in Brevo
- Set up Supabase
- Debug any errors
- Test the email sending

---

**Next:** Update your `.env.local` file with the Brevo API key and sender email, then we'll set up Supabase!
