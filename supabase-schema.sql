-- ================================================================
-- ClinicOS — Supabase SQL Schema
-- Run this in your Supabase project: SQL Editor → New Query
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------
-- Users (extends Supabase auth.users)
-- ----------------------------------------------------------------
CREATE TABLE users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL CHECK (role IN ('doctor', 'receptionist')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------
-- Doctors
-- ----------------------------------------------------------------
CREATE TABLE doctors (
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
CREATE TABLE patients (
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
CREATE TABLE availability (
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
CREATE TABLE appointments (
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
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, start_time);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ----------------------------------------------------------------
-- Walk-in Queue
-- ----------------------------------------------------------------
CREATE TABLE walkin_queue (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID REFERENCES patients(id),
  doctor_id   UUID REFERENCES doctors(id),
  arrived_at  TIMESTAMPTZ DEFAULT now(),
  status      TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'done')),
  position    INTEGER
);

-- ----------------------------------------------------------------
-- Row Level Security (RLS)
-- ----------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all (adjust per role as needed)
CREATE POLICY "auth read users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read doctors" ON doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read patients" ON patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read appts" ON appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read avail" ON availability FOR SELECT TO authenticated USING (true);

-- Receptionists can insert/update patients and appointments
CREATE POLICY "receptionist write patients" ON patients
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "receptionist write appointments" ON appointments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "receptionist update appointments" ON appointments
  FOR UPDATE TO authenticated USING (true);

-- Doctors can update their own availability
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

CREATE TRIGGER trg_freed_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_freed_at();

-- ----------------------------------------------------------------
-- Seed data (optional — remove in production)
-- ----------------------------------------------------------------
-- INSERT INTO doctors (name, specialty) VALUES
--   ('Dr. Sharma', 'General Medicine'),
--   ('Dr. Patel', 'Cardiology'),
--   ('Dr. Iyer', 'Orthopedics'),
--   ('Dr. Mehta', 'Pediatrics');
