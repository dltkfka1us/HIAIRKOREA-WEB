-- ================================================
-- HIAIRKOREA Supabase Full Migration Schema
-- ================================================

-- 1. 직원 테이블 (employees)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emp_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL, -- '김해', '부산', '창녕'
    department VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- 'admin', 'user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Public Write Employees" ON public.employees FOR ALL USING (true);

-- 2. 대시보드 통계 테이블 (dashboard_stats)
CREATE TABLE IF NOT EXISTS public.dashboard_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL, -- 'edu', 'tbm', 'legal'
    location VARCHAR(50) NOT NULL, -- '김해', '부산', '창녕', '전체'
    target_count INT DEFAULT 0,
    done_count INT DEFAULT 0,
    undone_count INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.dashboard_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Dashboard" ON public.dashboard_stats FOR SELECT USING (true);
CREATE POLICY "Public Write Dashboard" ON public.dashboard_stats FOR ALL USING (true);

-- 3. 정기안전교육 이수 기록 (edu_records)
CREATE TABLE IF NOT EXISTS public.edu_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    year_month VARCHAR(10) NOT NULL, -- 예: '2026-07'
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.edu_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read EduRecords" ON public.edu_records FOR SELECT USING (true);
CREATE POLICY "Public Write EduRecords" ON public.edu_records FOR ALL USING (true);

-- 4. TBM 일지 기록 (tbm_logs)
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

-- 5. 법정의무교육 기록 (legal_records)
CREATE TABLE IF NOT EXISTS public.legal_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    course_name VARCHAR(100) NOT NULL, -- '성희롱예방', '개인정보보호', '장애인인식개선', '퇴직연금', '중대재해처벌법'
    year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.legal_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Legal" ON public.legal_records FOR SELECT USING (true);
CREATE POLICY "Public Write Legal" ON public.legal_records FOR ALL USING (true);

-- 샘플 데이터 입력 (초기 테스트용)
INSERT INTO public.employees (emp_id, name, location, department, role) VALUES
('HK1001', '홍길동', '김해', '생산1팀', 'admin'),
('HK1002', '김철수', '김해', '생산2팀', 'user'),
('HK1003', '이영희', '부산', '품질관리팀', 'user'),
('HK1004', '박민수', '창녕', '물류팀', 'user')
ON CONFLICT (emp_id) DO NOTHING;
