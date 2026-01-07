-- ORBSPHERE Database Setup
-- Run this in Supabase SQL Editor if Prisma connection fails

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  address TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  "dueDate" TIMESTAMP NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "tasks_userId_idx" ON tasks("userId");

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  rating DOUBLE PRECISION NOT NULL DEFAULT 5
);

CREATE INDEX IF NOT EXISTS "providers_type_idx" ON providers(type);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "taskId" TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "providerId" TEXT NOT NULL REFERENCES providers(id),
  "scheduledDate" TIMESTAMP NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "bookings_userId_idx" ON bookings("userId");
CREATE INDEX IF NOT EXISTS "bookings_taskId_idx" ON bookings("taskId");

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "to" TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  "sentAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert sample providers
INSERT INTO providers (id, name, type, phone, email, address, rating)
VALUES
  ('1', 'Quick Plumbing', 'Plumbing', '(555) 123-4567', 'hello@quickplumbing.com', 'Austin, TX', 4.8),
  ('2', 'Premier Electric', 'Electrical', '(555) 234-5678', 'info@premierelectric.com', 'Austin, TX', 4.9),
  ('3', 'Cool Air HVAC', 'HVAC', '(555) 345-6789', 'service@coolair.com', 'Austin, TX', 4.7),
  ('4', 'Top Roofing Solutions', 'Roofing', '(555) 456-7890', 'contact@toproofing.com', 'Austin, TX', 4.6),
  ('5', 'Pest Control Experts', 'Pest Control', '(555) 567-8901', 'info@pestexperts.com', 'Austin, TX', 4.5)
ON CONFLICT (id) DO NOTHING;
