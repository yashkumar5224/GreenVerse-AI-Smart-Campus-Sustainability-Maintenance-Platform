-- GreenVerse Smart Campus Platform Database Schema
-- Target: Supabase / PostgreSQL (Production ready)
-- Includes: Idempotent Table creation, RLS Policies, Triggers, and Core Seeds.

-- =========================================================================
-- 1. EXTENSIONS & FUNCTIONS
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigger function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================================
-- 2. SCHEMAS & TABLES (Idempotent Setup)
-- =========================================================================

-- A. Users Profile Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('STUDENT', 'MAINTENANCE', 'ADMIN', 'SUPER_ADMIN', 'GUEST')),
    avatar_url TEXT,
    dept TEXT,
    points INTEGER DEFAULT 0,
    badge TEXT DEFAULT 'Eco Novice',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- B. Campus Infrastructure Tables
CREATE TABLE IF NOT EXISTS public.buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- C. IoT Sensor Telemetry Tables
CREATE TABLE IF NOT EXISTS public.sensors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('SMART_BIN', 'SOLAR_PANEL', 'WATER_TANK', 'LEAKAGE', 'ENERGY_METER', 'AQI', 'TEMP', 'HUMIDITY')),
    location TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL DEFAULT 'HEALTHY' CHECK (status IN ('HEALTHY', 'WARNING', 'CRITICAL')),
    last_reading DOUBLE PRECISION NOT NULL,
    battery INTEGER DEFAULT 100,
    unit TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sensor_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id TEXT REFERENCES public.sensors(id) ON DELETE CASCADE,
    value DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- D. Maintenance Tickets & Actions
CREATE TABLE IF NOT EXISTS public.complaints (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('ELECTRICAL', 'PLUMBING', 'HVAC', 'WASTE', 'OTHER', 'INFRASTRUCTURE')),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED')),
    location TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    reporter_id TEXT,
    reporter_name TEXT NOT NULL,
    assignee_id TEXT,
    assignee_name TEXT,
    image_url TEXT,
    after_image_url TEXT,
    voice_url TEXT,
    repair_notes TEXT,
    verified BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E. Notifications Feed
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    type TEXT NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'WARNING', 'CRITICAL', 'SUCCESS')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- F. Leaderboard Standings
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id TEXT UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    rank INTEGER,
    tier TEXT NOT NULL DEFAULT 'BRONZE' CHECK (tier IN ('BRONZE', 'SILVER', 'GOLD', 'DIAMOND')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- G. Audit Logging
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 3. TRIGGERS & TIMESTAMP MANAGERS (Re-runnable)
-- =========================================================================
DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_complaints_modtime ON public.complaints;
CREATE TRIGGER update_complaints_modtime BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =========================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles can be read by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can edit their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow full access to profiles" ON public.profiles;
CREATE POLICY "Allow full access to profiles" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Complaints Policies
DROP POLICY IF EXISTS "Complaints can be read by all authenticated users" ON public.complaints;
DROP POLICY IF EXISTS "Students can report tickets" ON public.complaints;
DROP POLICY IF EXISTS "Staff and Admins can update tickets" ON public.complaints;
DROP POLICY IF EXISTS "Allow full access to complaints" ON public.complaints;
CREATE POLICY "Allow full access to complaints" ON public.complaints FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Sensors Policies
DROP POLICY IF EXISTS "Sensors can be read by authenticated users" ON public.sensors;
DROP POLICY IF EXISTS "Only Admins can edit sensor settings" ON public.sensors;
DROP POLICY IF EXISTS "Allow full access to sensors" ON public.sensors;
CREATE POLICY "Allow full access to sensors" ON public.sensors FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Notifications Policies
DROP POLICY IF EXISTS "Allow full access to notifications" ON public.notifications;
CREATE POLICY "Allow full access to notifications" ON public.notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 5. INITIAL SEED RECORDS (SPNREC Campus Default Buildings)
-- =========================================================================
INSERT INTO public.buildings (name, code, latitude, longitude, description) VALUES
('Administrative Block', 'ADMIN', 26.1986, 87.3211, 'Offices, Director Chambers & Registration'),
('Academic Block', 'ACAD', 26.1991, 87.3209, 'Classrooms, Lecture Halls'),
('Computer Science Department', 'CSE', 26.1996, 87.3207, 'Programming Labs & Server Rooms'),
('Mechanical Department', 'MECH', 26.1998, 87.3214, 'Thermodynamics & Workshop Labs'),
('Civil Department', 'CIVIL', 26.1994, 87.3219, 'Hydraulics & Geotechnical Labs'),
('Electrical Department', 'EE', 26.1988, 87.3221, 'Power Systems & Machine Labs'),
('Central Library', 'LIB', 26.1992, 87.3215, 'Digital Library & Reading Rooms'),
('Boys Hostel', 'BHOSTEL', 26.2004, 87.3209, 'Student Accommodation Block A'),
('Solar Energy Plant', 'SOLAR', 26.2008, 87.3217, '250kW Solar Photovoltaic Grid'),
('Water Tank Complex', 'WATER', 26.2000, 87.3199, 'Main Overhead Storage & Pump Station')
ON CONFLICT (name) DO NOTHING;

-- =========================================================================
-- 6. USER SEEDING (Admin Account Provisioning)
-- =========================================================================

-- Seed Admin credentials into Supabase auth schema
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'd8c07248-e215-4c9f-b98a-21142e0cf274', -- Fixed unique UUID
    'authenticated',
    'authenticated',
    'yashkumar2278012@gmail.com',
    crypt('Admin@2026', gen_salt('bf')), -- Default password: Admin@2026
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Yash Kumar"}',
    now(),
    now(),
    '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

-- Seed Admin profile into public.profiles
INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    avatar_url,
    dept,
    points,
    badge
) VALUES (
    'd8c07248-e215-4c9f-b98a-21142e0cf274',
    'yashkumar2278012@gmail.com',
    'Yash Kumar',
    'ADMIN',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=yashkumar2278012@gmail.com',
    'Computer Science Department',
    100,
    'Eco Champion'
) ON CONFLICT (id) DO NOTHING;
