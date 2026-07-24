export type LocationType = '김해' | '부산' | '창녕' | '전체';
export type EduCategoryType = 'edu' | 'tbm' | 'legal';
export type UserRole = 'admin' | 'user';

export interface Employee {
  id: string;
  emp_id: string;
  name: string;
  location: LocationType;
  department: string;
  role: UserRole;
  created_at?: string;
}

export interface DashboardStat {
  id: string;
  category: EduCategoryType;
  location: LocationType;
  target_count: number;
  done_count: number;
  undone_count: number;
  updated_at?: string;
}

export interface EduRecord {
  id: string;
  employee_id: string;
  year_month: string;
  completed: boolean;
  completed_at?: string;
  employee?: Employee;
}

export interface TbmLog {
  id: string;
  log_date: string;
  location: LocationType;
  team_name: string;
  title: string;
  risk_factors: string;
  safety_measures: string;
  image_url?: string;
  created_at?: string;
}

export interface LegalRecord {
  id: string;
  employee_id: string;
  course_name: string;
  year: number;
  completed: boolean;
  completed_at?: string;
  employee?: Employee;
}
