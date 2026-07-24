'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardStat } from '@/lib/types';

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.from('dashboard_stats').select('*');
      if (data && !error) {
        setStats(data);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  // 카테고리별 데이터 계산 함수
  const getCategoryStats = (category: string) => {
    const items = stats.filter((s) => s.category === category);
    const target = items.reduce((acc, curr) => acc + curr.target_count, 0);
    const done = items.reduce((acc, curr) => acc + curr.done_count, 0);
    const undone = items.reduce((acc, curr) => acc + curr.undone_count, 0);
    const rate = target > 0 ? Math.round((done / target) * 100) : 0;
    return { target, done, undone, rate, items };
  };

  const edu = getCategoryStats('edu');
  const tbm = getCategoryStats('tbm');
  const legal = getCategoryStats('legal');

  // SVG 링 계산 (r=44 -> circumference ≈ 276.46)
  const getStrokeOffset = (rate: number) => {
    const circumference = 276.46;
    return circumference - (rate / 100) * circumference;
  };

  return (
    <div className="min-h-screen bg-[#f2f4f6] p-6 md:p-12 text-[#191f28]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 토스 스타일 상단 헤더 */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#3182f6] rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <i className="fa-solid fa-shield-halved text-lg"></i>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#191f28] tracking-tight">
                HIAIRKOREA 안전보건 대시보드
              </h1>
            </div>
            <p className="text-[#6b7684] text-sm mt-1.5 font-medium pl-12">
              Supabase + Next.js 기반 실시간 통합 안전관리 시스템
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 bg-[#e6f9ed] text-[#208a46] font-bold rounded-full text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-[#208a46] rounded-full animate-ping"></span>
              Supabase 연결완료 (0.1s)
            </span>
            <button className="px-5 py-2.5 bg-[#3182f6] hover:bg-[#1b64da] text-white rounded-2xl text-xs font-bold transition-all duration-200 shadow-md shadow-blue-500/15 active:scale-95">
              <i className="fa-solid fa-lock me-1.5"></i>관리자 로그인
            </button>
          </div>
        </header>

        {/* Row 1: KPI Dashboard Grid (Toss UI Theme) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. 정기안전교육 현황 */}
          <div className="toss-card">
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#f2f4f6]">
              <div className="toss-icon-box bg-[#e6f9ed] text-[#208a46]">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-[#191f28] text-lg">정기안전교육 현황</h3>
                <span className="text-xs text-[#8b95a1] font-semibold">금월 기준</span>
              </div>
              <span className="px-2.5 py-1 bg-[#e6f9ed] text-[#208a46] font-extrabold text-xs rounded-lg">
                {loading ? '-' : `${edu.rate}%`}
              </span>
            </div>

            <div className="toss-kpi-row">
              <div className="toss-kpi-item">
                <span className="label">대상</span>
                <span className="value">{loading ? '-' : edu.target}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">명</small></span>
              </div>
              <div className="toss-kpi-item">
                <span className="label">이수</span>
                <span className="value text-[#208a46]">{loading ? '-' : edu.done}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">명</small></span>
              </div>
              <div className="toss-kpi-item">
                <span className="label">미이수</span>
                <span className="value text-[#e53e3e]">{loading ? '-' : edu.undone}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">명</small></span>
              </div>
              <div className="toss-kpi-item">
                <span className="label">이수율</span>
                <span className="value text-[#3182f6]">{loading ? '-' : edu.rate}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">%</small></span>
              </div>
            </div>

            <div className="chart-gauge-row pt-1">
              {edu.items.map((loc) => {
                const rate = loc.target_count > 0 ? Math.round((loc.done_count / loc.target_count) * 100) : 0;
                return (
                  <div key={loc.id} className="gauge-item">
                    <div className="liq-gauge-wrap">
                      <svg className="liq-progress-ring" viewBox="0 0 100 100">
                        <circle className="liq-ring-bg" cx="50" cy="50" r="44" />
                        <circle
                          className="liq-ring-fill"
                          cx="50"
                          cy="50"
                          r="44"
                          stroke="#208a46"
                          strokeDasharray="276.46"
                          strokeDashoffset={getStrokeOffset(rate)}
                        />
                      </svg>
                      <div className="liq-tank-circle">
                        <div className="liq-val-circle">{rate}%</div>
                        <div className="liq-fill-circle bg-[#208a46]/15" style={{ height: `${rate}%` }}></div>
                      </div>
                    </div>
                    <span className="gauge-label">{loc.location}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. TBM 현황 */}
          <div className="toss-card">
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#f2f4f6]">
              <div className="toss-icon-box bg-[#f3edff] text-[#7944ed]">
                <i className="fa-solid fa-comments"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-[#191f28] text-lg">TBM 현황</h3>
                <span className="text-xs text-[#8b95a1] font-semibold">금일 기준</span>
              </div>
              <span className="px-2.5 py-1 bg-[#f3edff] text-[#7944ed] font-extrabold text-xs rounded-lg">
                {loading ? '-' : `${tbm.rate}%`}
              </span>
            </div>

            <div className="toss-kpi-row">
              <div className="toss-kpi-item">
                <span className="label">대상</span>
                <span className="value">{loading ? '-' : tbm.target}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">팀</small></span>
              </div>
              <div className="toss-kpi-item">
                <span className="label">완료</span>
                <span className="value text-[#208a46]">{loading ? '-' : tbm.done}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">팀</small></span>
              </div>
              <div className="toss-kpi-item">
                <span className="label">미실시</span>
                <span className="value text-[#e53e3e]">{loading ? '-' : tbm.undone}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">팀</small></span>
              </div>
              <div className="toss-kpi-item">
                <span className="label">실시율</span>
                <span className="value text-[#7944ed]">{loading ? '-' : tbm.rate}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">%</small></span>
              </div>
            </div>

            <div className="chart-gauge-row pt-1">
              {tbm.items.map((loc) => {
                const rate = loc.target_count > 0 ? Math.round((loc.done_count / loc.target_count) * 100) : 0;
                return (
                  <div key={loc.id} className="gauge-item">
                    <div className="liq-gauge-wrap">
                      <svg className="liq-progress-ring" viewBox="0 0 100 100">
                        <circle className="liq-ring-bg" cx="50" cy="50" r="44" />
                        <circle
                          className="liq-ring-fill"
                          cx="50"
                          cy="50"
                          r="44"
                          stroke="#7944ed"
                          strokeDasharray="276.46"
                          strokeDashoffset={getStrokeOffset(rate)}
                        />
                      </svg>
                      <div className="liq-tank-circle">
                        <div className="liq-val-circle">{rate}%</div>
                        <div className="liq-fill-circle bg-[#7944ed]/15" style={{ height: `${rate}%` }}></div>
                      </div>
                    </div>
                    <span className="gauge-label">{loc.location}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. 법정의무교육 현황 */}
          <div className="toss-card justify-between">
            <div>
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#f2f4f6]">
                <div className="toss-icon-box bg-[#e8f3ff] text-[#3182f6]">
                  <i className="fa-solid fa-gavel"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-[#191f28] text-lg">법정의무교육 현황</h3>
                  <span className="text-xs text-[#8b95a1] font-semibold">금년 기준</span>
                </div>
                <span className="px-2.5 py-1 bg-[#e8f3ff] text-[#3182f6] font-extrabold text-xs rounded-lg">
                  {loading ? '-' : `${legal.rate}%`}
                </span>
              </div>

              <div className="toss-kpi-row">
                <div className="toss-kpi-item">
                  <span className="label">대상</span>
                  <span className="value">{loading ? '-' : legal.target}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">명</small></span>
                </div>
                <div className="toss-kpi-item">
                  <span className="label">이수</span>
                  <span className="value text-[#208a46]">{loading ? '-' : legal.done}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">명</small></span>
                </div>
                <div className="toss-kpi-item">
                  <span className="label">미이수</span>
                  <span className="value text-[#e53e3e]">{loading ? '-' : legal.undone}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">명</small></span>
                </div>
                <div className="toss-kpi-item">
                  <span className="label">이수율</span>
                  <span className="value text-[#3182f6]">{loading ? '-' : legal.rate}<small className="text-xs font-normal text-[#8b95a1] ml-0.5">%</small></span>
                </div>
              </div>
            </div>

            <div className="mt-2 bg-[#f9fafb] p-4 rounded-2xl border border-[#f2f4f6]">
              <div className="flex justify-between items-center text-xs font-extrabold text-[#4e5968] mb-2">
                <span>연간 총 이수 진행률</span>
                <span className="text-[#3182f6] font-extrabold text-sm">{legal.rate}%</span>
              </div>
              <div className="w-full bg-[#e5e8eb] rounded-full h-3.5 overflow-hidden p-0.5">
                <div
                  className="bg-[#3182f6] h-full rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${legal.rate}%` }}
                ></div>
              </div>
            </div>
          </div>

        </section>

        {/* Row 2: Information Section Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 사고 속보 */}
          <div className="toss-card">
            <div className="flex items-center gap-3 pb-4 border-b border-[#f2f4f6] mb-4">
              <div className="toss-icon-box bg-[#fff0f0] text-[#e53e3e]">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3 className="font-extrabold text-[#191f28] text-lg flex-1">사고 속보</h3>
              <span className="w-2 h-2 bg-[#e53e3e] rounded-full animate-pulse"></span>
            </div>
            <div className="space-y-2.5">
              <div className="p-3.5 bg-[#f9fafb] hover:bg-[#f2f4f6] rounded-2xl transition duration-150 flex justify-between items-center text-sm cursor-pointer group">
                <span className="font-semibold text-[#333d4b] group-hover:text-[#3182f6] truncate transition">
                  [KOSHA] 제조사업장 크레인 작업 안전주의보
                </span>
                <span className="text-xs font-bold text-[#8b95a1] bg-white px-2 py-1 rounded-lg ml-2 shrink-0">오늘</span>
              </div>
              <div className="p-3.5 bg-[#f9fafb] hover:bg-[#f2f4f6] rounded-2xl transition duration-150 flex justify-between items-center text-sm cursor-pointer group">
                <span className="font-semibold text-[#333d4b] group-hover:text-[#3182f6] truncate transition">
                  [중대재해] 혹서기 온열질환 예방 수칙 준수
                </span>
                <span className="text-xs font-bold text-[#8b95a1] bg-white px-2 py-1 rounded-lg ml-2 shrink-0">어제</span>
              </div>
            </div>
          </div>

          {/* 안전 뉴스 */}
          <div className="toss-card">
            <div className="flex items-center gap-3 pb-4 border-b border-[#f2f4f6] mb-4">
              <div className="toss-icon-box bg-[#e8f3ff] text-[#3182f6]">
                <i className="fa-solid fa-newspaper"></i>
              </div>
              <h3 className="font-extrabold text-[#191f28] text-lg flex-1">최신 안전 뉴스</h3>
            </div>
            <div className="space-y-2.5">
              <div className="p-3.5 bg-[#f9fafb] hover:bg-[#f2f4f6] rounded-2xl transition duration-150 text-sm font-semibold text-[#333d4b] hover:text-[#3182f6] cursor-pointer">
                산업안전보건법 개정안 주요 내용 정리 안내
              </div>
              <div className="p-3.5 bg-[#f9fafb] hover:bg-[#f2f4f6] rounded-2xl transition duration-150 text-sm font-semibold text-[#333d4b] hover:text-[#3182f6] cursor-pointer">
                2026년 하반기 TBM 우수사례 공유 및 지침
              </div>
            </div>
          </div>

          {/* 사업장 날씨 정보 */}
          <div className="toss-card">
            <div className="flex items-center gap-3 pb-4 border-b border-[#f2f4f6] mb-4">
              <div className="toss-icon-box bg-[#fff8e6] text-[#d97706]">
                <i className="fa-solid fa-cloud-sun"></i>
              </div>
              <h3 className="font-extrabold text-[#191f28] text-lg flex-1">사업장 실시간 날씨</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 bg-[#f9fafb] rounded-2xl border border-[#f2f4f6] flex flex-col items-center justify-between">
                <span className="text-xs text-[#6b7684] font-bold">김해</span>
                <i className="fa-solid fa-sun text-amber-500 text-2xl my-2"></i>
                <span className="text-base font-extrabold text-[#191f28]">28°C</span>
              </div>
              <div className="p-3.5 bg-[#f9fafb] rounded-2xl border border-[#f2f4f6] flex flex-col items-center justify-between">
                <span className="text-xs text-[#6b7684] font-bold">부산</span>
                <i className="fa-solid fa-cloud-sun text-amber-400 text-2xl my-2"></i>
                <span className="text-base font-extrabold text-[#191f28]">26°C</span>
              </div>
              <div className="p-3.5 bg-[#f9fafb] rounded-2xl border border-[#f2f4f6] flex flex-col items-center justify-between">
                <span className="text-xs text-[#6b7684] font-bold">창녕</span>
                <i className="fa-solid fa-sun text-amber-500 text-2xl my-2"></i>
                <span className="text-base font-extrabold text-[#191f28]">29°C</span>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
