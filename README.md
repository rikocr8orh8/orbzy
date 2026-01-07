# ORBSPHERE - Home Maintenance Scheduler MVP

A complete home maintenance scheduling SaaS application built with Next.js 14, Supabase, and Stripe.

## Features

- **User Authentication**: Secure signup/login with Supabase Auth
- **Task Management**: Create, track, and complete maintenance tasks
- **Provider Booking**: Book local service providers for your tasks
- **Email Notifications**: Automated email confirmations via SendGrid
- **Stripe Integration**: Ready for subscription payments
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Email**: SendGrid
- **Payments**: Stripe
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier)
- A SendGrid account (free tier)
- A Stripe account (test mode)

### 1. Install Dependencies

```bash
cd orbsphere
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Copy your project URL and anon key
4. Go to **Project Settings** → **Database** and copy the connection string

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Update the following in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres

# SendGrid
SENDGRID_API_KEY=SG.your-api-key-here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Database

Push the Prisma schema to your database:

```bash
npm run prisma:push
```

Seed the database with sample providers:

```bash
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## Project Structure

```
orbsphere/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                     # Static files
├── scripts/
│   └── seed.ts                # Database seed script
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css        # Global styles
│   │   ├── auth/              # Auth pages
│   │   │   ├── signup/
│   │   │   └── login/
│   │   ├── dashboard/         # Main dashboard
│   │   └── api/               # API routes
│   │       ├── auth/          # Auth endpoints
│   │       ├── tasks/         # Task CRUD
│   │       └── bookings/      # Booking creation
│   ├── components/            # React components
│   │   ├── Navbar.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   ├── ProviderCard.tsx
│   │   └── BookingModal.tsx
│   ├── lib/                   # Utilities
│   │   ├── supabase.ts
│   │   ├── supabaseServer.ts
│   │   └── prisma.ts
│   └── utils/
│       └── types.ts           # TypeScript types
├── .env.local                 # Environment variables
├── next.config.js             # Next.js config
├── tailwind.config.ts         # Tailwind config
└── package.json
```

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Sign in user
- `POST /api/auth/logout` - Sign out user

### Tasks
- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Bookings
- `POST /api/bookings` - Create booking with email notifications

## Database Schema

### Models
- **User**: User accounts with email/password
- **Task**: Maintenance tasks with categories and due dates
- **Provider**: Service providers (plumber, electrician, etc.)
- **Booking**: Appointments between users and providers
- **EmailLog**: Sent email tracking

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prisma:push  # Push schema to database
npm run prisma:studio # Open Prisma Studio
npm run seed         # Seed database with sample data
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy!

Vercel will automatically:
- Install dependencies
- Build the Next.js app
- Deploy to a production URL

## Set Up Stripe Subscription

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create a new product: "ORBSPHERE Pro" at $15/month
3. Create a payment link
4. Update the Stripe link in:
   - `src/app/page.tsx` (landing page pricing section)
   - `src/app/dashboard/page.tsx` (upgrade CTA)

## SendGrid Setup

1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Create an API key with "Mail Send" permissions
3. Verify a sender email address
4. Update `SENDGRID_FROM_EMAIL` in `.env.local`

## Customization

### Add More Provider Categories

Edit `src/components/TaskForm.tsx`:

```typescript
const CATEGORIES = [
  'HVAC',
  'Plumbing',
  'Electrical',
  'Roofing',
  'Pest Control',
  'General Maintenance',
  'Landscaping',  // Add new category
]
```

### Modify Email Templates

Edit `src/app/api/bookings/route.ts` to customize email content.

### Change Color Scheme

Edit `tailwind.config.ts` to customize colors and theme.

## Troubleshooting

### Database Connection Issues
- Ensure your Supabase project is active
- Check that the DATABASE_URL is correct
- Verify your IP is not blocked in Supabase settings

### Email Not Sending
- Verify your SendGrid API key is valid
- Check that the sender email is verified
- Look for error logs in the console

### Authentication Errors
- Ensure Supabase URL and keys are correct
- Check that cookies are enabled in your browser
- Verify the API keys are for the correct project

## Next Steps for Production

1. **Enable Row Level Security** in Supabase
2. **Set up email confirmation** for new signups
3. **Add phone verification** for providers
4. **Implement provider onboarding** flow
5. **Add rating/review system** for providers
6. **Create admin dashboard** for managing providers
7. **Add notification system** for upcoming tasks
8. **Implement search/filter** for providers by location
9. **Add calendar integration** for task scheduling
10. **Set up analytics** (PostHog, Plausible, etc.)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact support@orbsphere.app

---

**Built with ❤️ for hassle-free home maintenance**
