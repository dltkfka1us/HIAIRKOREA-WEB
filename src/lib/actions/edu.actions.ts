'use server';

import { supabase } from '../supabase';

export async function getEduDashboardStats(targetYearMonth: string) {
  // 실제 구현에서는 targetYearMonth (e.g. '2026-07')를 기반으로 edu_records와 employees를 조인합니다.
  
  // 빠른 개발을 위해 Supabase 연동 코드는 뼈대로 남기고,
  // 우선은 기존 UI 동작을 완벽히 재현하는 Mock Data를 반환합니다.
  
  /*
  const { data: employees, error: empErr } = await supabase.from('employees').select('*').eq('is_active', true);
  const { data: records, error: recErr } = await supabase.from('edu_records').select('*').eq('record_month', targetYearMonth);
  // 집계 로직 수행...
  */

  // 기존 Service_Edu.js 의 반환 형태(stats) 구조 모방
  const stats = {
    totalTarget: 535,
    totalCompleted: 464,
    locations: {
      '김해': {
        target: 200,
        completed: 162, // 81%
        people: [
          { name: '김철수', dept: '생산1팀', status: 'incomplete', isExempt: false },
          { name: '이영희', dept: '품질관리팀', status: 'complete', isExempt: false },
        ]
      },
      '부산': {
        target: 150,
        completed: 142, // 95%
        people: [
          { name: '박민수', dept: '물류팀', status: 'incomplete', isExempt: false },
        ]
      },
      '창녕': {
        target: 185,
        completed: 160, // ~86%
        people: [
          { name: '정지훈', dept: '연구개발팀', status: 'incomplete', isExempt: false },
        ]
      }
    }
  };

  return stats;
}

export async function getEduYearlyTrend(year: number) {
  // 1월부터 12월까지의 평균 이수율 배열을 반환
  // 기존 Service_Edu.js 의 getRegularEduYearlyTrend 역할

  /*
  const { data, error } = await supabase.from('edu_records').select('*').like('record_month', `${year}-%`);
  // 월별 그룹핑 및 집계
  */

  // Fallback Mock Data
  return [
    92, 94, 91, 88, 89, 90, 87, 0, 0, 0, 0, 0 // 1~7월까지의 이수율, 8~12월은 0 (미래)
  ];
}
