-- ================================================
-- HIAIRKOREA Supabase Full Migration Schema
-- ================================================

-- 1. ì§ì› í…Œì´ë¸” (employees)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emp_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL, -- 'ê¹€í•´', 'ë¶€ì‚°', 'ì°½ë…•'
    department VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- 'admin', 'user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Public Write Employees" ON public.employees FOR ALL USING (true);

-- 2. ëŒ€ì‹œë³´ë“œ í†µê³„ í…Œì´ë¸” (dashboard_stats)
CREATE TABLE IF NOT EXISTS public.dashboard_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL, -- 'edu', 'tbm', 'legal'
    location VARCHAR(50) NOT NULL, -- 'ê¹€í•´', 'ë¶€ì‚°', 'ì°½ë…•', 'ì „ì²´'
    target_count INT DEFAULT 0,
    done_count INT DEFAULT 0,
    undone_count INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.dashboard_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Dashboard" ON public.dashboard_stats FOR SELECT USING (true);
CREATE POLICY "Public Write Dashboard" ON public.dashboard_stats FOR ALL USING (true);

-- 3. ì •ê¸°ì•ˆì „êµìœ¡ ì´ìˆ˜ ê¸°ë¡ (edu_records)
CREATE TABLE IF NOT EXISTS public.edu_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    year_month VARCHAR(10) NOT NULL, -- ì˜ˆ: '2026-07'
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.edu_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read EduRecords" ON public.edu_records FOR SELECT USING (true);
CREATE POLICY "Public Write EduRecords" ON public.edu_records FOR ALL USING (true);

-- 4. TBM ì¼ì§€ ê¸°ë¡ (tbm_logs)
CREATE TABLE IF NOT EXISTS public.tbm_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    location VARCHAR(50) NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    risk_factors TEXT,
    safety_measures TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.tbm_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read TBM" ON public.tbm_logs FOR SELECT USING (true);
CREATE POLICY "Public Write TBM" ON public.tbm_logs FOR ALL USING (true);

-- 5. ë²•ì •ì˜ë¬´êµìœ¡ ê¸°ë¡ (legal_records)
CREATE TABLE IF NOT EXISTS public.legal_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    course_name VARCHAR(100) NOT NULL, -- 'ì„±í¬ë¡±ì˜ˆë°©', 'ê°œì¸ì •ë³´ë³´í˜¸', 'ì¥ì• ì¸ì¸ì‹ê°œì„ ', 'í‡´ì§ì—°ê¸ˆ', 'ì¤‘ëŒ€ì¬í•´ì²˜ë²Œë²•'
    year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.legal_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Legal" ON public.legal_records FOR SELECT USING (true);
CREATE POLICY "Public Write Legal" ON public.legal_records FOR ALL USING (true);

-- ìƒ˜í”Œ ë°ì´í„° ì…ë ¥ (ì´ˆê¸° í…ŒìŠ¤íŠ¸ìš©)
INSERT INTO public.employees (emp_id, name, location, department, role) VALUES
('HK1001', 'í™ê¸¸ë™', 'ê¹€í•´', 'ìƒì‚°1íŒ€', 'admin'),
('HK1002', 'ê¹€ì² ìˆ˜', 'ê¹€í•´', 'ìƒì‚°2íŒ€', 'user'),
('HK1003', 'ì´ì˜í¬', 'ë¶€ì‚°', 'í’ˆì§ˆê´€ë¦¬íŒ€', 'user'),
('HK1004', 'ë°•ë¯¼ìˆ˜', 'ì°½ë…•', 'ë¬¼ë¥˜íŒ€', 'user')
ON CONFLICT (emp_id) DO NOTHING;

-- 6. ¾ÈÀü°ü¸®ÀÚ ¼±ÀÓ ±â·Ï (safety_officers)
CREATE TABLE IF NOT EXISTS public.safety_officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    qualification_name VARCHAR(100) NOT NULL, -- '°¡½º¾ÈÀü°ü¸®ÀÚ', 'Àü±â¾ÈÀü°ü¸®ÀÚ', 'À§Çè¹°¾ÈÀü°ü¸®ÀÚ'
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.safety_officers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read SafetyOfficers" ON public.safety_officers FOR SELECT USING (true);
CREATE POLICY "Public Write SafetyOfficers" ON public.safety_officers FOR ALL USING (true);

-- 7. Àü»ç °øÁö»çÇ× (notices)
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Public Write Notices" ON public.notices FOR ALL USING (true);

-- »ùÇÃ µ¥ÀÌÅÍ Ãß°¡
INSERT INTO public.safety_officers (employee_id, qualification_name, expiry_date) VALUES
((SELECT id FROM public.employees WHERE emp_id = 'HK1004'), '°¡½º¾ÈÀü°ü¸®ÀÚ', '2026-09-05'),
((SELECT id FROM public.employees WHERE emp_id = 'HK1002'), 'Àü±â¾ÈÀü°ü¸®ÀÚ', '2026-06-02'),
((SELECT id FROM public.employees WHERE emp_id = 'HK1001'), 'À§Çè¹°¾ÈÀü°ü¸®ÀÚ', '2026-06-02')
ON CONFLICT DO NOTHING;

INSERT INTO public.notices (title, content) VALUES
('±İÀÏ Àü »ç¾÷Àå ÇÊ¼ö TBM ¾È°Ç ¹× °øÁö', '¾ÈÀüº¸È£±¸ Âø¿ë »óÅÂ ºÒ·® ½Ã Áï°¢ ÀÛ¾÷ ÁßÁö Á¶Ä¡ ¿¹Á¤ÀÔ´Ï´Ù.')
ON CONFLICT DO NOTHING;

-- 8. Á¤±â¾ÈÀü±³À° ÀÌ¼ö ±â·Ï (edu_records)
CREATE TABLE IF NOT EXISTS public.edu_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    record_month VARCHAR(7) NOT NULL, -- e.g., '2026-07'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(employee_id, record_month)
);

ALTER TABLE public.edu_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read EduRecords" ON public.edu_records FOR SELECT USING (true);
CREATE POLICY "Public Write EduRecords" ON public.edu_records FOR ALL USING (true);

-- »ùÇÃ µ¥ÀÌÅÍ Ãß°¡ (2026³â 7¿ùºĞ ÀÌ¼öÀÚ ÀÏºÎ µî·Ï)
INSERT INTO public.edu_records (employee_id, record_month) VALUES
((SELECT id FROM public.employees WHERE emp_id = 'HK1001'), '2026-07'),
((SELECT id FROM public.employees WHERE emp_id = 'HK1003'), '2026-07'),
((SELECT id FROM public.employees WHERE emp_id = 'HK1004'), '2026-07')
ON CONFLICT DO NOTHING;
