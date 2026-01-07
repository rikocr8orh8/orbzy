# Orbzy Private Beta Testing Guide

## Overview
This document provides instructions for testing Orbzy before private beta launch.

**⚠️ IMPORTANT:** All payment features are **DISABLED** for private beta. Beta users get full access completely free.

---

## 🧪 Automated Testing

### Unit Tests (Jest + React Testing Library)

**Run all unit tests:**
```bash
npm test
```

**Run tests in CI mode (no watch):**
```bash
npm run test:ci
```

**Critical test coverage:**
- ✅ User signup/login flow
- ✅ Provider booking logic
- ✅ Task scheduling core functions
- ✅ Email verification system
- ✅ 24-hour escalation system

---

### E2E Tests (Playwright)

**Run E2E tests across all browsers:**
```bash
npm run test:e2e
```

**Run with UI mode (visual debugging):**
```bash
npm run test:e2e:ui
```

**Run in headed mode (see browser):**
```bash
npm run test:e2e:headed
```

**Test browsers:**
- ✅ Google Chrome (Chromium)
- ✅ Safari (WebKit)
- ✅ Microsoft Edge
- ✅ Firefox
- ✅ Mobile Chrome (Pixel 5 viewport)
- ✅ Mobile Safari (iPhone 12 viewport)

**Main user journey tested:**
1. User signs up → Email verification
2. User logs in → Dashboard access
3. Create task → Select category
4. View providers → Matching providers appear first
5. Book provider → Schedule appointment
6. (View free beta badge - no payment required)

---

### Linting & Code Quality

**Run ESLint:**
```bash
npm run lint
```

**Auto-fix issues:**
```bash
npm run lint:fix
```

**What ESLint checks:**
- ✅ Security issues (no eval, no unsafe code)
- ✅ Code quality (unused vars, const vs let)
- ✅ React best practices
- ✅ TypeScript correctness
- ✅ Syntax errors

---

### Run All Automated Tests

**Complete test suite:**
```bash
npm run test:all
```

This runs: Linting → Unit tests → E2E tests

---

## ✅ Manual Smoke Test Checklist

Run this checklist before deploying to beta users.

### **Desktop Testing (Primary)**

#### 1. Landing Page
- [ ] Page loads without errors
- [ ] All service categories display (HVAC, Plumbing, Electrical, Roofing, General, Gutters)
- [ ] "Get Started" button works
- [ ] "Sign In" button works
- [ ] Glassmorphism effects render correctly
- [ ] All text is readable

#### 2. Signup Flow
- [ ] Navigate to signup page (`/auth/signup`)
- [ ] Form displays correctly with all fields
- [ ] Email validation works (rejects invalid emails)
- [ ] Password validation works (minimum length)
- [ ] Submit button shows loading state
- [ ] Success screen appears with email verification message
- [ ] Verification email is sent (check inbox/spam)
- [ ] Redirects to login page after 5 seconds

#### 3. Email Verification
- [ ] Click verification link in email
- [ ] Verification page loads and shows loading spinner
- [ ] Success message appears ("Email verified successfully")
- [ ] Redirects to login page after 3 seconds
- [ ] Login page shows green success banner

#### 4. Login Flow
- [ ] Navigate to login page (`/auth/login`)
- [ ] Form displays correctly
- [ ] Entering wrong password shows error
- [ ] Unverified email shows verification error
- [ ] Correct credentials redirect to dashboard
- [ ] Session persists on page refresh

#### 5. Dashboard - Task Creation
- [ ] Dashboard loads with navbar and task form
- [ ] "Create New Task" section is visible
- [ ] All form fields work (title, description, category, urgency, address)
- [ ] Category dropdown shows all options
- [ ] Urgency level selector works
- [ ] Submit creates task successfully
- [ ] New task appears in task list
- [ ] Task shows correct urgency indicator

#### 6. Dashboard - Provider Matching
- [ ] After creating task, providers appear below
- [ ] **Critical**: Providers matching task category appear FIRST
  - Example: Creating "Electrical" task shows electrical providers at top
- [ ] All provider cards display: name, type, rating, contact info
- [ ] Provider cards are clickable

#### 7. Dashboard - Booking Flow
- [ ] Click on a provider card
- [ ] Booking modal opens
- [ ] Date picker works (future dates only)
- [ ] Time picker works
- [ ] "Confirm Booking" button works
- [ ] Success message appears
- [ ] Task status updates to "Confirmed" or "Booked"
- [ ] Provider details are saved

#### 8. Logout
- [ ] Click "Logout" button in navbar
- [ ] Shows "Logging out..." state
- [ ] Redirects to landing page
- [ ] Session is cleared (can't access dashboard without login)

#### 9. Error Handling
- [ ] Try accessing `/dashboard` without login → redirects to login
- [ ] Submit empty forms → validation errors display
- [ ] Network error during signup → error message shows
- [ ] All error messages are user-friendly (no stack traces)

---

### **Mobile Testing** (Quick Check)

Test on your actual phone or use browser DevTools mobile view.

#### iPhone/Android
- [ ] Open landing page on mobile browser
- [ ] Page is responsive (no horizontal scroll)
- [ ] All buttons are tappable (not too small)
- [ ] Forms are usable (inputs don't zoom weirdly)
- [ ] Navigation works smoothly
- [ ] Glass effects render on mobile
- [ ] Complete one signup → login → task creation flow

**Browsers to test:**
- [ ] Safari (iOS)
- [ ] Chrome (Android/iOS)
- [ ] Firefox (optional)

---

### **Browser Compatibility** (Desktop)

#### Chrome
- [ ] Full user journey works
- [ ] No console errors

#### Safari
- [ ] Full user journey works
- [ ] Glassmorphism effects display
- [ ] Date/time picker works

#### Firefox
- [ ] Full user journey works
- [ ] No layout issues

#### Edge
- [ ] Full user journey works
- [ ] No compatibility issues

---

### **Database & Backend**

#### Verify Data Persistence
- [ ] Open Prisma Studio: `npm run prisma:studio`
- [ ] Check Users table has new signups
- [ ] Check Tasks table has created tasks
- [ ] Check Bookings table has bookings
- [ ] Check EmailLog table has verification emails
- [ ] Verify email verification tokens are set/cleared correctly

#### API Endpoints
- [ ] POST `/api/auth/signup` - creates users
- [ ] GET `/api/auth/verify-email?token=...` - verifies emails
- [ ] NextAuth `/api/auth/signin` - handles login
- [ ] All endpoints return proper error messages

---

### **Email Delivery** (Resend)

#### Test Email Flow
- [ ] Signup with real email address
- [ ] Email arrives within 1 minute
- [ ] Email has correct subject: "Verify your Orbzy account"
- [ ] Email has purple gradient button
- [ ] Verification link works when clicked
- [ ] Email looks good on desktop and mobile email clients

---

### **Performance**

#### Page Load Times
- [ ] Landing page loads in < 2 seconds
- [ ] Dashboard loads in < 3 seconds
- [ ] No excessive network requests
- [ ] Images/assets load properly

#### Responsiveness
- [ ] Forms submit without delays
- [ ] Loading states appear for async actions
- [ ] No UI freezing or lag

---

### **Security**

#### Basic Security Checks
- [ ] Passwords are hashed (not visible in database)
- [ ] Can't access other users' data
- [ ] SQL injection protected (Prisma ORM)
- [ ] XSS protected (React escaping)
- [ ] CSRF tokens present (NextAuth)
- [ ] Environment variables not exposed in client

---

### **Edge Cases**

#### Test These Scenarios
- [ ] Signup with already registered email → shows error
- [ ] Use expired verification token → shows error
- [ ] Create task with missing fields → validation works
- [ ] Book provider without selecting date → validation works
- [ ] Refresh page mid-flow → state is maintained
- [ ] Multiple rapid clicks on submit → doesn't create duplicates
- [ ] Very long task descriptions → UI doesn't break

---

## 🚀 Pre-Beta Launch Checklist

Before inviting beta users:

### **Code Quality**
- [ ] All lint errors fixed: `npm run lint`
- [ ] All unit tests pass: `npm run test:ci`
- [ ] All E2E tests pass: `npm run test:e2e`
- [ ] No console errors in production build
- [ ] TypeScript compilation successful

### **Deployment**
- [ ] Production build succeeds: `npm run build`
- [ ] Environment variables set on Railway
- [ ] Database migrations applied
- [ ] Provider data seeded
- [ ] Resend API key configured
- [ ] NEXTAUTH_SECRET is random and secure
- [ ] Railway domain is working

### **Documentation**
- [ ] README.md updated
- [ ] API documentation exists
- [ ] User guide/help docs ready (optional for MVP)

### **Monitoring**
- [ ] Error logging enabled
- [ ] Database backups configured
- [ ] Uptime monitoring set up (optional)

### **Final Manual Test**
- [ ] Complete full user journey on production URL
- [ ] Test from 2-3 different devices
- [ ] Verify emails are delivered to real addresses
- [ ] Check error messages are friendly
- [ ] Verify all links work

---

## 🐛 Reporting Issues

If you find bugs during testing:

1. **Note the details:**
   - What you did (steps to reproduce)
   - What you expected
   - What actually happened
   - Browser/device
   - Screenshot if applicable

2. **Check console for errors:**
   - Open DevTools (F12)
   - Look for red errors in Console tab
   - Copy the error message

3. **Create an issue:**
   - Use GitHub Issues
   - Include all details above
   - Label as `bug`, `critical`, `enhancement`, etc.

---

## 📊 GitHub Actions CI/CD

Every push to `main` or `develop` branch triggers:

1. **Lint** - Code quality checks
2. **Unit Tests** - Fast, isolated tests
3. **E2E Tests** - Full browser tests (Chrome, Firefox, Safari)
4. **Build** - Verifies production build works
5. **Security Audit** - Checks for vulnerabilities
6. **Deploy** - Auto-deploys to Railway (main branch only)

**View pipeline status:**
- Go to GitHub repository
- Click "Actions" tab
- See green ✅ or red ❌ for each run

**Pipeline must pass before merging PRs!**

---

## 🎯 Success Criteria

The MVP is ready for beta when:
- ✅ All automated tests pass
- ✅ Manual smoke test checklist complete
- ✅ No critical bugs found
- ✅ Core user journey works smoothly
- ✅ Email delivery is reliable
- ✅ Mobile experience is acceptable
- ✅ CI/CD pipeline is green

---

## 🔗 Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run prisma:studio         # Open database GUI

# Testing
npm test                      # Run unit tests (watch mode)
npm run test:ci              # Run unit tests (CI mode)
npm run test:e2e             # Run E2E tests
npm run test:e2e:ui          # Run E2E with UI
npm run test:all             # Run all tests

# Linting
npm run lint                 # Check code quality
npm run lint:fix             # Auto-fix issues

# Build
npm run build                # Production build
npm start                    # Start production server

# Database
npm run prisma:push          # Update database schema
npm run seed:providers       # Seed provider data
```

---

## 📝 Notes

- **Payment Integration**: DISABLED for private beta. All features are free. See [BETA_LAUNCH.md](BETA_LAUNCH.md) for re-enablement instructions.
- **24-hour Escalation**: Backend logic is implemented but cron job not yet scheduled.
- **Provider Seeding**: Run `npm run seed:providers` to populate test providers.
- **Test Database**: Use separate DATABASE_URL for testing to avoid polluting production data.

---

**Last Updated:** 2026-01-06
**Version:** 1.0 (MVP Testing)
