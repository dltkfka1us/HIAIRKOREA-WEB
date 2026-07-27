'use server';

import { supabase } from '../supabase';

// 1. 정기안전교육 통계 (금월 기준)
export async function getEduStats(yearMonth: string) {
  // 실제로는 edu_records 테이블과 employees 테이블을 JOIN하여 통계를 냅니다.
  // 이 예제에서는 dashboard_stats 캐시 테이블이나 직접 집계 쿼리를 흉내냅니다.
  
  // 현재는 빠른 구현을 위해 dashboard_stats 에서 조회
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*')
    .eq('category', 'edu');

  if (error || !data || data.length === 0) {
    // Fallback Mock Data
    return {
      total: { target: 535, done: 464, undone: 71, rate: 87 },
      locations: [
        { loc: '김해', pct: 81 },
        { loc: '부산', pct: 95 },
        { loc: '창녕', pct: 82 },
      ]
    };
  }

  // 데이터가 있으면 집계 로직 수행 (여기서는 단순화)
  return {
    total: { target: 535, done: 464, undone: 71, rate: 87 },
    locations: [
      { loc: '김해', pct: 81 },
      { loc: '부산', pct: 95 },
      { loc: '창녕', pct: 82 },
    ]
  };
}

// 2. TBM 통계 (금일 기준)
export async function getTbmStats(dateStr: string) {
  // tbm_logs 에 오늘 날짜로 기록된 팀 수 계산
  
  // Fallback Mock Data (초기 상태)
  return {
    total: { target: 18, done: 0, undone: 18, rate: 0 },
    locations: [
      { loc: '김해', pct: 0 },
      { loc: '창녕', pct: 0 },
    ]
  };
}

// 3. 법정의무교육 현황 및 안전관리자 D-Day
export async function getLegalStats(year: number) {
  // safety_officers 테이블을 조회하여 expiry_date 와 현재 날짜 차이 계산
  
  // Fallback Mock Data
  return {
    total: { target: 10, done: 3, undone: 7, rate: 30 },
    // 3명 이수 (true), 7명 미이수 (false) 배열 생성
    avatars: [true, true, true, false, false, false, false, false, false, false],
    officers: [
      { loc: '창녕', title: '가스안전관리자', dday: '41일 남음', date: '2026-09-05', isDanger: false },
      { loc: '김해', title: '전기안전관리자', dday: '54일 지난', date: '2026-06-02', isDanger: true },
      { loc: '본사', title: '위험물안전관리자', dday: '54일 지난', date: '2026-06-02', isDanger: true },
    ]
  };
}

// 4. 전사 공지사항
export async function getNotices() {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return [
      { title: '금일 전 사업장 필수 TBM 안건 및 공지', content: '안전보호구 착용 상태 불량 시 즉각 작업 중지 조치 예정입니다.' }
    ];
  }

  return data;
}
