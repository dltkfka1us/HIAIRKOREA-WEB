'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardStat, LocationType } from '@/lib/types';

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('전체');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

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

  // 필터링 적용된 카테고리별 통계 계산
  const getCategoryStats = (category: string) => {
    let items = stats.filter((s) => s.category === category);
    if (selectedLocation !== '전체') {
      items = items.filter((s) => s.location === selectedLocation);
    }
    const target = items.reduce((acc, curr) => acc + curr.target_count, 0);
    const done = items.reduce((acc, curr) => acc + curr.done_count, 0);
    const undone = items.reduce((acc, curr) => acc + curr.undone_count, 0);
    const rate = target > 0 ? Math.round((done / target) * 100) : 0;
    return { target, done, undone, rate, items: stats.filter((s) => s.category === category) };
  };

  const edu = getCategoryStats('edu');
  const tbm = getCategoryStats('tbm');
  const legal = getCategoryStats('legal');

  // SVG 링 offset 계산 (r=44 -> circumference ≈ 276.46)
  const getStrokeOffset = (rate: number) => {
    const circumference = 276.46;
    return circumference - (rate / 100) * circumference;
  };

  const openNotice = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setActiveModal('notice');
  };

  return (
    <div className="min-h-screen bg-[#f2f4f6] p-4 md:p-10 text-[#191f28] relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 상단 글로벌 헤더 & 무재해 전광판 */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-2 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3182f6] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                <i className="fa-solid fa-shield-halved text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#191f28] tracking-tight flex items-center gap-2">
                  HIAIRKOREA 안전보건 대시보드
                </h1>
                <p className="text-[#6b7684] text-xs md:text-sm font-medium mt-0.5">
                  작업 전 TBM은 사고를 막는 가장 확실한 예방입니다.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* 무재해 전광판 */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-black/5 shadow-sm">
              <span className="text-xs font-bold text-[#6b7684]">무재해</span>
              <div className="flex gap-1 font-mono text-sm font-extrabold">
                <span className="bg-[#191f28] text-white px-2 py-0.5 rounded-md">1</span>
                <span className="bg-[#191f28] text-white px-2 py-0.5 rounded-md">9</span>
                <span className="bg-[#191f28] text-white px-2 py-0.5 rounded-md">7</span>
                <span className="bg-[#191f28] text-white px-2 py-0.5 rounded-md">4</span>
              </div>
              <span className="text-xs font-bold text-[#191f28]">일</span>
            </div>

            <span className="px-3.5 py-2 bg-[#e6f9ed] text-[#208a46] font-bold rounded-2xl text-xs flex items-center gap-2 border border-[#208a46]/10">
              <span className="w-2.5 h-2.5 bg-[#208a46] rounded-full animate-ping"></span>
              Supabase 연동
            </span>

            <button 
              onClick={() => openNotice('관리자 인증', '관리자 전용 로그인 페이지로 이동합니다.')}
              className="px-4 py-2 bg-[#3182f6] hover:bg-[#1b64da] text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/15 active:scale-95 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-lock text-xs"></i>
              관리자 로그인
            </button>
          </div>
        </header>

        {/* 상단 탭 네비게이션 (기존 GAS 메뉴 이주) */}
        <nav className="bg-white p-2 rounded-2xl border border-black/5 shadow-sm flex items-center gap-1 overflow-x-auto">
          <button className="px-4 py-2 bg-[#3182f6] text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm">
            <i className="fa-solid fa-house"></i> HOME
          </button>
          <button className="px-4 py-2 hover:bg-[#f2f4f6] text-[#6b7684] hover:text-[#191f28] font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition">
            <i className="fa-solid fa-graduation-cap text-green-600"></i> 정기안전교육
          </button>
          <button className="px-4 py-2 hover:bg-[#f2f4f6] text-[#6b7684] hover:text-[#191f28] font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition">
            <i className="fa-solid fa-comments text-purple-600"></i> TBM
          </button>
          <button className="px-4 py-2 hover:bg-[#f2f4f6] text-[#6b7684] hover:text-[#191f28] font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition">
            <i className="fa-solid fa-triangle-exclamation text-amber-500"></i> 위험성평가
          </button>
          <button className="px-4 py-2 hover:bg-[#f2f4f6] text-[#6b7684] hover:text-[#191f28] font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition">
            <i className="fa-solid fa-gavel text-blue-600"></i> 법정의무교육
          </button>
          <button className="px-4 py-2 hover:bg-[#f2f4f6] text-[#6b7684] hover:text-[#191f28] font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition">
            <i className="fa-solid fa-heart-pulse text-red-500"></i> 직무스트레스
          </button>
          <button className="px-4 py-2 hover:bg-[#f2f4f6] text-[#6b7684] hover:text-[#191f28] font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition">
            <i className="fa-solid fa-robot text-teal-600"></i> AI챗봇
          </button>
          <button className="px-4 py-2 hover:bg-[#f2f4f6] text-[#6b7684] hover:text-[#191f28] font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition">
            <i className="fa-solid fa-building-user text-indigo-600"></i> 외부업체
          </button>
          <button className="px-4 py-2 hover:bg-[#f2f4f6] text-[#6b7684] hover:text-[#191f28] font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition">
            <i className="fa-solid fa-folder-open text-gray-600"></i> 서식자료
          </button>
        </nav>

        {/* 사업장 셀렉터 필터바 (Toss Segmented Control) */}
        <div className="bg-white p-2 rounded-2xl border border-black/5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-1 bg-[#f2f4f6] p-1.5 rounded-xl w-full sm:w-auto">
            {(['전체', '김해', '부산', '창녕'] as LocationType[]).map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex-1 sm:flex-initial ${
                  selectedLocation === loc
                    ? 'bg-white text-[#3182f6] shadow-sm font-extrabold'
                    : 'text-[#6b7684] hover:text-[#191f28]'
                }`}
              >
                {loc === '전체' ? '🏢 전체 사업장' : `📍 ${loc} 사업장`}
              </button>
            ))}
          </div>

          <span className="hidden sm:block text-xs font-semibold text-[#8b95a1] pr-3">
            선택된 사업장: <strong className="text-[#3182f6] font-extrabold">{selectedLocation}</strong>
          </span>
        </div>

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
                <span className="text-xs text-[#8b95a1] font-semibold">금월 기준 ({selectedLocation})</span>
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
                const isSelected = selectedLocation === '전체' || selectedLocation === loc.location;
                return (
                  <div key={loc.id} className={`gauge-item transition-opacity ${isSelected ? 'opacity-100' : 'opacity-30'}`}>
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
                <span className="text-xs text-[#8b95a1] font-semibold">금일 기준 ({selectedLocation})</span>
              </div>
              <button 
                onClick={() => openNotice('TBM 공지사항', '작업 개시 전 위험성평가 기반 TBM을 반드시 실시하고 서명해 주세요.')}
                className="px-3 py-1 bg-[#f3edff] hover:bg-[#e9dffc] text-[#7944ed] font-extrabold text-xs rounded-xl flex items-center gap-1 transition"
              >
                <i className="fa-solid fa-bullhorn text-xs"></i> 공지사항
              </button>
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
                const isSelected = selectedLocation === '전체' || selectedLocation === loc.location;
                return (
                  <div key={loc.id} className={`gauge-item transition-opacity ${isSelected ? 'opacity-100' : 'opacity-30'}`}>
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

          {/* 3. 법정의무교육 현황 & 선임자 자격 관리 */}
          <div className="toss-card justify-between space-y-3">
            <div>
              <div className="flex items-center gap-3.5 pb-3 border-b border-[#f2f4f6]">
                <div className="toss-icon-box bg-[#e8f3ff] text-[#3182f6]">
                  <i className="fa-solid fa-gavel"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-[#191f28] text-lg">법정의무교육 현황</h3>
                  <span className="text-xs text-[#8b95a1] font-semibold">금년 기준 ({selectedLocation})</span>
                </div>
                <span className="px-2.5 py-1 bg-[#e8f3ff] text-[#3182f6] font-extrabold text-xs rounded-lg">
                  {loading ? '-' : `${legal.rate}%`}
                </span>
              </div>

              <div className="toss-kpi-row my-3">
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

            {/* 선임자 자격 만료 D-Day 알림 리스트 (기존 GAS 이주) */}
            <div className="space-y-1.5 bg-[#f9fafb] p-3 rounded-2xl border border-[#f2f4f6]">
              <div className="text-[11px] font-bold text-[#8b95a1] mb-1.5 flex justify-between">
                <span>안전선임자 자격 관리</span>
                <span className="text-[#e53e3e]">D-Day 알림</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 bg-white rounded-xl border border-black/5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-bold text-[10px]">창녕</span>
                  <span className="font-bold text-[#333d4b]">가스안전관리자</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#e53e3e] font-extrabold text-[11px]">41일 남음</span>
                  <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-mono">2026-09-05</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-2 bg-white rounded-xl border border-black/5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-bold text-[10px]">김해</span>
                  <span className="font-bold text-[#333d4b]">전기안전관리자</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#e53e3e] font-extrabold text-[11px]">만료</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-mono">2026-06-02</span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Row 2: Information Section Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 사고 속보 */}
          <div className="toss-card">
            <div className="flex items-center justify-between pb-3 border-b border-[#f2f4f6] mb-3">
              <div className="flex items-center gap-2.5">
                <div className="toss-icon-box bg-[#fff0f0] text-[#e53e3e]">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 className="font-extrabold text-[#191f28] text-lg">사고 속보</h3>
              </div>
              <span className="px-2.5 py-1 bg-red-100 text-red-600 font-extrabold text-[11px] rounded-full flex items-center gap-1 animate-pulse">
                🚨 중대재해 사이렌
              </span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              <div 
                onClick={() => openNotice('사고 속보: 추락 사망사고', '[대구 수성구] 창호를 해체작업 중 단부로 떨어짐 (사망 1명)')}
                className="p-2.5 bg-[#f9fafb] hover:bg-[#f2f4f6] rounded-xl transition flex justify-between items-center text-xs cursor-pointer group"
              >
                <span className="font-semibold text-[#333d4b] group-hover:text-[#3182f6] truncate">
                  [대구 수성구] 창호 해체작업 중 단부 추락
                </span>
                <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md shrink-0 ml-2">사망 1명</span>
              </div>

              <div 
                onClick={() => openNotice('사고 속보: 끼임 사고', '[경기 평택시] 가공설비 정비 작업 중 끼임 (사망 1명)')}
                className="p-2.5 bg-[#f9fafb] hover:bg-[#f2f4f6] rounded-xl transition flex justify-between items-center text-xs cursor-pointer group"
              >
                <span className="font-semibold text-[#333d4b] group-hover:text-[#3182f6] truncate">
                  [경기 평택시] 가공설비 정비 작업 중 끼임
                </span>
                <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md shrink-0 ml-2">사망 1명</span>
              </div>

              <div 
                onClick={() => openNotice('사고 속보: 감전 사고', '[충남 서산시] 태양광 설비 전선 교체작업 중 감전 (사망 1명)')}
                className="p-2.5 bg-[#f9fafb] hover:bg-[#f2f4f6] rounded-xl transition flex justify-between items-center text-xs cursor-pointer group"
              >
                <span className="font-semibold text-[#333d4b] group-hover:text-[#3182f6] truncate">
                  [충남 서산시] 태양광 설비 교체작업 중 감전
                </span>
                <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md shrink-0 ml-2">사망 1명</span>
              </div>
            </div>
          </div>

          {/* 최신 안전 뉴스 */}
          <div className="toss-card">
            <div className="flex items-center gap-3 pb-3 border-b border-[#f2f4f6] mb-3">
              <div className="toss-icon-box bg-[#e8f3ff] text-[#3182f6]">
                <i className="fa-solid fa-newspaper"></i>
              </div>
              <h3 className="font-extrabold text-[#191f28] text-lg flex-1">최신 안전 뉴스</h3>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              <div 
                onClick={() => openNotice('안전 뉴스', '비행기 추락사고 생존자가 24년만에 펼친 삶의 기록')}
                className="p-2.5 bg-[#f9fafb] hover:bg-[#f2f4f6] rounded-xl transition text-xs font-semibold text-[#333d4b] hover:text-[#3182f6] cursor-pointer flex justify-between items-center"
              >
                <span className="truncate">비행기 추락사고 생존자가 24년만에 펼친 삶의 기록</span>
                <span className="text-[10px] text-[#8b95a1] shrink-0 ml-2">07-27</span>
              </div>

              <div 
                onClick={() => openNotice('안전 뉴스', '8월 전 점검 필수... 고용노동부 Q&A 가이드')}
                className="p-2.5 bg-[#f9fafb] hover:bg-[#f2f4f6] rounded-xl transition text-xs font-semibold text-[#333d4b] hover:text-[#3182f6] cursor-pointer flex justify-between items-center"
              >
                <span className="truncate">[안전보건공시제] 8월 전 점검 필수... 고용노동부 Q&A</span>
                <span className="text-[10px] text-[#8b95a1] shrink-0 ml-2">07-27</span>
              </div>

              <div 
                onClick={() => openNotice('안전 뉴스', '2026년 산재 사망 11.8% 줄었다...')}
                className="p-2.5 bg-[#f9fafb] hover:bg-[#f2f4f6] rounded-xl transition text-xs font-semibold text-[#333d4b] hover:text-[#3182f6] cursor-pointer flex justify-between items-center"
              >
                <span className="truncate">2026년 산재 사망 11.8% 줄었다... 중소기업 지침</span>
                <span className="text-[10px] text-[#8b95a1] shrink-0 ml-2">07-26</span>
              </div>
            </div>
          </div>

          {/* 사업장 날씨 상세 정보 */}
          <div className="toss-card">
            <div className="flex items-center justify-between pb-3 border-b border-[#f2f4f6] mb-3">
              <div className="flex items-center gap-2.5">
                <div className="toss-icon-box bg-[#fff8e6] text-[#d97706]">
                  <i className="fa-solid fa-cloud-sun"></i>
                </div>
                <h3 className="font-extrabold text-[#191f28] text-lg">날씨 정보</h3>
              </div>
              <span className="text-[11px] font-bold text-[#8b95a1]">08:40 기준</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 bg-[#f9fafb] rounded-2xl border border-[#f2f4f6] flex flex-col items-center justify-between">
                <span className="text-xs text-[#6b7684] font-bold">김해</span>
                <span className="text-[10px] text-blue-600 font-bold mt-1">어제기준 ▼1.5°</span>
                <i className="fa-solid fa-sun text-amber-500 text-xl my-1.5"></i>
                <span className="text-sm font-extrabold text-[#191f28]">28.9°C</span>
                <span className="text-[10px] text-[#8b95a1]">체감 30.4°C</span>
              </div>

              <div className="p-3 bg-[#f9fafb] rounded-2xl border border-[#f2f4f6] flex flex-col items-center justify-between">
                <span className="text-xs text-[#6b7684] font-bold">부산</span>
                <span className="text-[10px] text-blue-600 font-bold mt-1">어제기준 ▼0.6°</span>
                <i className="fa-solid fa-cloud text-gray-400 text-xl my-1.5"></i>
                <span className="text-sm font-extrabold text-[#191f28]">30.8°C</span>
                <span className="text-[10px] text-[#8b95a1]">체감 32.3°C</span>
              </div>

              <div className="p-3 bg-[#f9fafb] rounded-2xl border border-[#f2f4f6] flex flex-col items-center justify-between">
                <span className="text-xs text-[#6b7684] font-bold">창녕</span>
                <span className="text-[10px] text-blue-600 font-bold mt-1">어제기준 ▼1.5°</span>
                <i className="fa-solid fa-sun text-amber-500 text-xl my-1.5"></i>
                <span className="text-sm font-extrabold text-[#191f28]">30.2°C</span>
                <span className="text-[10px] text-[#8b95a1]">체감 31.8°C</span>
              </div>
            </div>
          </div>

        </section>

      </div>

      {/* 우측 하단 AI 챗봇 둥둥이 버튼 (Floating AI Assistant Widget) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-black/5 text-xs font-extrabold text-[#191f28] animate-bounce">
          무엇이든 물어보세요 🤖
        </div>
        <button 
          onClick={() => openNotice('안전보건 AI 챗봇', '안전보건관련 궁금한 규정이나 위험성평가 수칙을 질문해 보세요!')}
          className="w-14 h-14 bg-[#3182f6] hover:bg-[#1b64da] text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 transition-all hover:scale-110 active:scale-95"
        >
          <i className="fa-solid fa-robot text-2xl"></i>
        </button>
      </div>

      {/* 모달 팝업 */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-extrabold text-[#191f28]">{modalTitle}</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#6b7684] flex items-center justify-center hover:bg-[#e5e8eb] font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-[#4e5968] leading-relaxed font-medium">
              {modalContent}
            </p>
            <div className="pt-2 text-right">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-[#3182f6] text-white rounded-2xl text-xs font-bold hover:bg-[#1b64da] transition"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
