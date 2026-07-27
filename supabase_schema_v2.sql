-- ==========================================
-- HIAIRKOREA Safety App - Supabase Schema
-- ==========================================

-- 1. Config Table
CREATE TABLE IF NOT EXISTS public.app_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TBM Logs
CREATE TABLE IF NOT EXISTS public.tbm_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    type VARCHAR(50),
    conductor VARCHAR(100),
    content TEXT,
    issues TEXT,
    photo_urls TEXT[], 
    participants TEXT[],
    signatures TEXT[],
    safety_notice TEXT,
    production_notice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Edu Records
CREATE TABLE IF NOT EXISTS public.edu_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    emp_id VARCHAR(50),
    location VARCHAR(50),
    department VARCHAR(100),
    emp_name VARCHAR(100),
    edu_date DATE,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Legal (Safety Officers)
CREATE TABLE IF NOT EXISTS public.safety_officers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    location VARCHAR(50),
    title VARCHAR(100),
    officer_name VARCHAR(100),
    appointed_date DATE,
    prev_edu_date DATE,
    next_edu_date DATE,
    allowance BOOLEAN DEFAULT false,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Accident News (KOSHA + Gemini parsed data)
CREATE TABLE IF NOT EXISTS public.accident_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kosha_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(100),
    content TEXT,
    casualty VARCHAR(50),
    url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
