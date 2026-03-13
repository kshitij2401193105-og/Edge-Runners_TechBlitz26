-- ================================================================
-- ClinicOS — Supabase SQL Schema + Seed Data
-- Run this in your Supabase project: SQL Editor → New Query
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------
-- Users (extends Supabase auth.users)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL CHECK (role IN ('doctor', 'receptionist')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------
-- Doctors
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  specialty   TEXT NOT NULL DEFAULT 'General',
  phone       TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------
-- Patients
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patients (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  age         INTEGER,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------
-- Availability (doctor working hours per day)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS availability (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id      UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week    INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time     TIME NOT NULL,
  end_time       TIME NOT NULL,
  slot_duration  INTEGER NOT NULL DEFAULT 15,  -- minutes
  is_active      BOOLEAN DEFAULT true,
  UNIQUE(doctor_id, day_of_week)
);

-- ----------------------------------------------------------------
-- Appointments
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id     UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  start_time    TIMESTAMPTZ NOT NULL,
  end_time      TIMESTAMPTZ NOT NULL,
  status        TEXT NOT NULL DEFAULT 'confirmed'
                CHECK (status IN ('confirmed', 'cancelled', 'completed', 'walkin')),
  type          TEXT DEFAULT 'General',
  notes         TEXT,
  freed_at      TIMESTAMPTZ,   -- set when cancelled (for "recently freed" UI)
  created_at    TIMESTAMPTZ DEFAULT now(),

  -- Prevent double booking at DB level
  CONSTRAINT no_overlap EXCLUDE USING gist (
    doctor_id WITH =,
    tstzrange(start_time, end_time) WITH &&
  ) WHERE (status = 'confirmed')
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ----------------------------------------------------------------
-- Row Level Security (RLS)
-- ----------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all (adjust per role as needed)
DROP POLICY IF EXISTS "auth read users" ON users;
CREATE POLICY "auth read users" ON users FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth read doctors" ON doctors;
CREATE POLICY "auth read doctors" ON doctors FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth read patients" ON patients;
CREATE POLICY "auth read patients" ON patients FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth read appts" ON appointments;
CREATE POLICY "auth read appts" ON appointments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth read avail" ON availability;
CREATE POLICY "auth read avail" ON availability FOR SELECT TO authenticated USING (true);

-- Receptionists can insert/update patients and appointments
DROP POLICY IF EXISTS "receptionist write patients" ON patients;
CREATE POLICY "receptionist write patients" ON patients
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "receptionist write appointments" ON appointments;
CREATE POLICY "receptionist write appointments" ON appointments
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "receptionist update appointments" ON appointments;
CREATE POLICY "receptionist update appointments" ON appointments
  FOR UPDATE TO authenticated USING (true);

-- Doctors can update their own availability
DROP POLICY IF EXISTS "doctor update availability" ON availability;
CREATE POLICY "doctor update availability" ON availability
  FOR ALL TO authenticated
  USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- ----------------------------------------------------------------
-- Trigger: auto-set freed_at on cancellation
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_freed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
    NEW.freed_at = now();
  END IF;
  RETURN NEW;
 END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_freed_at ON appointments;
CREATE TRIGGER trg_freed_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_freed_at();

-- ================================================================
-- 🚀 SEED DATA FOR HACKATHON DEMO
-- ================================================================

/*
INSTRUCTIONS:
1. First, create 3 users in your Supabase Auth dashboard:
   - sarah@clinic.com (Doctor)
   - michael@clinic.com (Doctor)
   - admin@clinic.com (Receptionist)
2. Copy their User IDs from the Auth dashboard and replace the placeholders below.
3. Then run these INSERT statements.
*/

-- 1. Insert into public.users
-- REPLACE 'YOUR_AUTH_UUID_1' with actual UUIDs from Supabase Auth!
INSERT INTO users (id, name, email, role) VALUES
  ('e96a5a53-0894-4e1d-bab8-fa662a9bb4dc', 'Dr. John Doe', 'doctor@gmail.com', 'doctor'),
  ('52de433b-32bc-4bb0-b5ec-dd225261f700', 'Dr. Michael Chen', 'receptionist@gmail.com', 'doctor'),
  ('9cd31d8b-cd67-4dae-996a-95968903f3b8', 'Admin', 'kshitij@gmail.com', 'receptionist');

-- 2. Insert Doctors
-- Make sure the user_id matches the UUIDs above!
INSERT INTO doctors (id, user_id, name, specialty, phone, email) VALUES
  ('d1a1b1c1-0000-0000-0000-000000000001', 'e96a5a53-0894-4e1d-bab8-fa662a9bb4dc', 'Dr. John Doe', 'Cardiology', '555-0101', 'doctor@gmail.com'),
  ('d2b2c2d2-0000-0000-0000-000000000002', '52de433b-32bc-4bb0-b5ec-dd225261f700', 'Dr. Michael Chen', 'Pediatrics', '555-0102', 'receptionist@gmail.com');

-- 3. Insert Patients
INSERT INTO patients (id, name, phone, email, age) VALUES
  ('f1a1b1c1-0000-0000-0000-000000000001', 'John Doe', '555-1001', 'john@example.com', 45),
  ('f2b2c2d2-0000-0000-0000-000000000002', 'Jane Smith', '555-1002', 'jane@example.com', 32),
  ('f3c3d3e3-0000-0000-0000-000000000003', 'Bob Johnson', '555-1003', 'bob@example.com', 58),
  ('f4d4e4f4-0000-0000-0000-000000000004', 'Alice Brown', '555-1004', 'alice.b@example.com', 24),
  ('f5e5f5a5-0000-0000-0000-000000000005', 'Charlie Davis', '555-1005', 'charlie@example.com', 12);

-- 4. Insert Appointments
INSERT INTO appointments (doctor_id, patient_id, start_time, end_time, status, type, notes) VALUES
  ('d1a1b1c1-0000-0000-0000-000000000001', 'f1a1b1c1-0000-0000-0000-000000000001', now() + interval '1 day', now() + interval '1 day 30 minutes', 'confirmed', 'Checkup', 'Routine checkup'),
  ('d1a1b1c1-0000-0000-0000-000000000001', 'f2b2c2d2-0000-0000-0000-000000000002', now() + interval '1 day 1 hour', now() + interval '1 day 1 hour 30 minutes', 'confirmed', 'Follow-up', 'Blood test review'),
  ('d2b2c2d2-0000-0000-0000-000000000002', 'f3c3d3e3-0000-0000-0000-000000000003', now() + interval '2 days', now() + interval '2 days 45 minutes', 'confirmed', 'Consultation', 'Knee pain'),
  ('d2b2c2d2-0000-0000-0000-000000000002', 'f4d4e4f4-0000-0000-0000-000000000004', now() + interval '2 days 2 hours', now() + interval '2 days 2 hours 15 minutes', 'confirmed', 'Checkup', 'Annual physical'),
  ('d1a1b1c1-0000-0000-0000-000000000001', 'f5e5f5a5-0000-0000-0000-000000000005', now() + interval '3 days', now() + interval '3 days 30 minutes', 'confirmed', 'Vaccination', 'Flu shot');
