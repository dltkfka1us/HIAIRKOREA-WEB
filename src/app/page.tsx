'use client';

import { useState } from 'react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('HOME');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const openModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setActiveModal('notice');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-4 md:p-8 text-[#2c3e50] font-sans relative">
      <div className="max-w-[1400px] mx-auto space-y-5">
        
        {/* Row 0: Original Header (Branding & Slogan & Non-Disaster Counter) */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-2 gap-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-[#1e88e5] rounded-xl flex items-center justify-center text-white shadow-md font-black text-xl">
              h
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#1565c0] tracking-tight flex items-center gap-2">
                Safety and Health Management System
              </h1>
              <p className="text-[#64748b] text-xs font-semibold mt-0.5">
                쾌적한 작업 환경은 우리 모두가 함께 만듭니다.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* 무재해 카운터 (기존 디자인 100% 동일) */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs font-bold text-[#64748b]">무재해</span>
              <div className="flex gap-1 font-mono text-sm font-extrabold">
                <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded">1</span>
                <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded">9</span>
                <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded">7</span>
                <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded">4</span>
              </div>
              <span className="text-xs font-bold text-[#1e293b]">일</span>
            </div>

            {/* 상단 아이콘 메뉴 */}
            <div className="flex items-center gap-2 text-[#64748b] text-sm bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
              <button title="시약 관리" className="p-1.5 hover:text-[#1e88e5] hover:bg-gray-100 rounded-lg transition"><i className="fa-solid fa-flask"></i></button>
              <button title="일정 관리" className="p-1.5 hover:text-[#1e88e5] hover:bg-gray-100 rounded-lg transition"><i className="fa-solid fa-calendar-days"></i></button>
              <button title="즐겨찾기" className="p-1.5 hover:text-[#1e88e5] hover:bg-gray-100 rounded-lg transition"><i className="fa-solid fa-bookmark"></i></button>
              <button onClick={() => openModal('관리자 로그인', '관리자 전용 인증 화면입니다.')} title="관리자 로그인" className="p-1.5 hover:text-[#1e88e5] hover:bg-gray-100 rounded-lg transition"><i className="fa-solid fa-key"></i></button>
            </div>
          </div>
        </header>

        {/* Row 0.5: Navigation Bar (Original Pill Active Tabs) */}
        <nav className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'HOME', label: 'HOME', icon: 'fa-house' },
            { id: 'EDU', label: '정기안전교육', icon: 'fa-graduation-cap' },
            { id: 'TBM', label: 'TBM', icon: 'fa-comments' },
            { id: 'RISK', label: '위험성평가', icon: 'fa-triangle-exclamation' },
            { id: 'LEGAL', label: '법정의무교육', icon: 'fa-gavel' },
            { id: 'STRESS', label: '직무스트레스', icon: 'fa-heart-pulse' },
            { id: 'AI', label: 'AI챗봇', icon: 'fa-robot' },
            { id: 'FACILITY', label: '시설물', icon: 'fa-building' },
            { id: 'EXTERNAL', label: '외부업체', icon: 'fa-handshake' },
            { id: 'DOCS', label: '서식자료', icon: 'fa-folder-open' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#1e88e5] text-white shadow-md font-extrabold'
                  : 'text-[#64748b] hover:bg-gray-100 hover:text-[#1e293b]'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Row 1: 3 Main Cards (Education, TBM, Legal) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* 1. 정기안전교육 현황 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <h3 className="font-extrabold text-[#1e293b] text-base">정기안전교육 현황</h3>
              <span className="text-xs text-[#94a3b8] font-medium">(금월 기준)</span>
            </div>

            {/* KPI 숫자 요약 */}
            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl my-4 text-center">
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">대상</div>
                <div className="text-base font-black text-[#1e293b]">535<small className="text-xs font-normal">명</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">이수</div>
                <div className="text-base font-black text-emerald-600">464<small className="text-xs font-normal">명</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">미이수</div>
                <div className="text-base font-black text-rose-500">71<small className="text-xs font-normal">명</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">이수율</div>
                <div className="text-base font-black text-[#1e88e5]">87<small className="text-xs font-normal">%</small></div>
              </div>
            </div>

            {/* 사업장별 게이지 차트 (기존 100% 동일) */}
            <div className="flex justify-around items-center pt-1 text-center">
              {[
                { loc: '김해', pct: 81 },
                { loc: '부산', pct: 95 },
                { loc: '창녕', pct: 82 },
              ].map((item) => (
                <div key={item.loc} className="flex flex-col items-center gap-1.5">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeDasharray="263.89"
                        strokeDashoffset={263.89 - (item.pct / 100) * 263.89}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute font-black text-xs text-[#1e293b]">{item.pct}%</span>
                  </div>
                  <span className="text-xs font-bold text-[#64748b]">{item.loc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. TBM 현황 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-comments"></i>
                </div>
                <h3 className="font-extrabold text-[#1e293b] text-base">TBM 현황</h3>
                <span className="text-xs text-[#94a3b8] font-medium">(금일 기준)</span>
              </div>
              <button 
                onClick={() => openModal('공지사항 설정', '금일 전 사업장 필수 TBM 안건 및 공지 내용입니다.')}
                className="px-2.5 py-1 bg-purple-50 text-purple-600 hover:bg-purple-100 text-xs font-bold rounded-lg transition border border-purple-200/50 flex items-center gap-1"
              >
                <i className="fa-solid fa-bullhorn text-xs"></i> 공지사항
              </button>
            </div>

            {/* KPI 숫자 요약 */}
            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl my-4 text-center">
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">대상</div>
                <div className="text-base font-black text-[#1e293b]">18<small className="text-xs font-normal">팀</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">완료</div>
                <div className="text-base font-black text-emerald-600">0<small className="text-xs font-normal">팀</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">미실시</div>
                <div className="text-base font-black text-rose-500">18<small className="text-xs font-normal">팀</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">실시율</div>
                <div className="text-base font-black text-purple-600">0<small className="text-xs font-normal">%</small></div>
              </div>
            </div>

            {/* 사업장별 게이지 차트 */}
            <div className="flex justify-around items-center pt-1 text-center">
              {[
                { loc: '김해', pct: 0 },
                { loc: '창녕', pct: 0 },
              ].map((item) => (
                <div key={item.loc} className="flex flex-col items-center gap-1.5">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="8"
                        strokeDasharray="263.89"
                        strokeDashoffset={263.89 - (item.pct / 100) * 263.89}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute font-black text-xs text-[#1e293b]">{item.pct}%</span>
                  </div>
                  <span className="text-xs font-bold text-[#64748b]">{item.loc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 법정의무교육 현황 (사람 아이콘 + 자격 D-Day 리스트 100% 동일) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-3">
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-gavel"></i>
                </div>
                <h3 className="font-extrabold text-[#1e293b] text-base">법정의무교육 현황</h3>
                <span className="text-xs text-[#94a3b8] font-medium">(금년 기준)</span>
              </div>

              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl my-3 text-center">
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">대상</div>
                  <div className="text-base font-black text-[#1e293b]">10<small className="text-xs font-normal">명</small></div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">이수</div>
                  <div className="text-base font-black text-emerald-600">3<small className="text-xs font-normal">명</small></div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">미이수</div>
                  <div className="text-base font-black text-rose-500">7<small className="text-xs font-normal">명</small></div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">이수율</div>
                  <div className="text-base font-black text-[#1e88e5]">30<small className="text-xs font-normal">%</small></div>
                </div>
              </div>

              {/* 사람 이모티콘 상태 (3명 이수 🔵, 7명 미이수 🔴) */}
              <div className="flex justify-center items-center gap-1.5 py-1 text-sm">
                <i className="fa-solid fa-user-check text-blue-500"></i>
                <i className="fa-solid fa-user-check text-blue-500"></i>
                <i className="fa-solid fa-user-check text-blue-500"></i>
                <i className="fa-solid fa-user-xmark text-rose-500"></i>
                <i className="fa-solid fa-user-xmark text-rose-500"></i>
                <i className="fa-solid fa-user-xmark text-rose-500"></i>
                <i className="fa-solid fa-user-xmark text-rose-500"></i>
                <i className="fa-solid fa-user-xmark text-rose-500"></i>
                <i className="fa-solid fa-user-xmark text-rose-500"></i>
                <i className="fa-solid fa-user text-gray-300"></i>
              </div>
            </div>

            {/* 선임 관리자 자격 만료 D-Day 알림 스크롤 리스트 */}
            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-2xl border border-gray-100 max-h-32 overflow-y-auto">
              <div className="flex items-center justify-between text-xs p-1.5 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-bold text-[10px]">창녕</span>
                  <span className="font-bold text-[#334155] text-xs">가스안전관리자(...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-extrabold text-[11px]">41일 남음</span>
                  <span className="text-[10px] border border-orange-300 text-orange-600 px-1.5 py-0.5 rounded font-mono">2026-09-05</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-1.5 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-bold text-[10px]">김해</span>
                  <span className="font-bold text-[#334155] text-xs">전기안전관리자</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-extrabold text-[11px]">54일 지난</span>
                  <span className="text-[10px] border border-rose-300 text-rose-600 px-1.5 py-0.5 rounded font-mono">2026-06-02</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-1.5 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-bold text-[10px]">대물</span>
                  <span className="font-bold text-[#334155] text-xs">위험물안전관리자</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-extrabold text-[11px]">54일 지난</span>
                  <span className="text-[10px] border border-rose-300 text-rose-600 px-1.5 py-0.5 rounded font-mono">2026-06-02</span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Row 2: Info Grid (KOSHA News, Safety News, Weather) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* 1. 사고 속보 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col hover:shadow-md transition">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 className="font-extrabold text-[#1e293b] text-base">사고 속보</h3>
              </div>
              <button 
                onClick={() => openModal('중대재해 사이렌', '전국 중대재해 발생 속보 및 주의보 경보 수칙입니다.')}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs rounded-xl flex items-center gap-1 transition border border-rose-200/60"
              >
                <i className="fa-solid fa-bell text-xs text-rose-500"></i> 중대재해 사이렌
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {[
                { loc: '[대구 수성구]', text: '창호를 해체작업 중 단부로 떨어짐', tag: '사망 1명' },
                { loc: '[경기 평택시]', text: '가공설비 정비 작업 중 끼임', tag: '사망 1명' },
                { loc: '[충남 보령시]', text: '사다리에 올라가 전국기 설치 준비 작업 중 떨어짐', tag: '사망 1명' },
                { loc: '[충남 서산시]', text: '태양광 설비 전선 교체작업 중 감전', tag: '사망 1명' },
                { loc: '[경남 사천시]', text: '제어판넬 내 전선 연결작업 중 감전', tag: '사망 1명' },
                { loc: '[충남 당진시]', text: '적재기 조정 작업 중 끼임', tag: '사망 1명' },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => openModal('사고 속보 상세', `${item.loc} ${item.text}`)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition flex justify-between items-center text-xs cursor-pointer group border border-gray-100"
                >
                  <span className="font-semibold text-[#334155] group-hover:text-[#1e88e5] truncate">
                    <strong className="text-[#1e88e5] mr-1">{item.loc}</strong>{item.text}
                  </span>
                  <span className="text-[10px] font-extrabold text-rose-600 border border-rose-200 bg-rose-50 px-2 py-0.5 rounded-md shrink-0 ml-2">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 최신 안전 뉴스 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col hover:shadow-md transition">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-3">
              <div className="w-9 h-9 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center text-lg">
                <i className="fa-solid fa-newspaper"></i>
              </div>
              <h3 className="font-extrabold text-[#1e293b] text-base">최신 안전 뉴스</h3>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {[
                { title: '철강 3사, 지난해 모두 사망사고...안전지표 개선도 \'숙제\'', date: '07-27' },
                { title: '권은비, 필라테스 추락 사고 당했다..."구멍으로 빠져" [스타이슈]', date: '07-27' },
                { title: '경산시, 재해 매뉴얼 개정...예방부터 사고 수습까지 정비', date: '07-27' },
                { title: '동래구, 안전 실천 결의대회 개최..."중대재해 없는 안전한 일터 ...', date: '07-27' },
                { title: 'HD현대중공업 군산조선소 끼임 사고로 사망자 1명 발생', date: '07-27' },
                { title: '서울시설공단, 산업재해 예방 유공 고용노동부 장관표창 수상', date: '07-27' },
              ].map((news, idx) => (
                <div 
                  key={idx}
                  onClick={() => openModal('안전 뉴스 상세', news.title)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-xs font-semibold text-[#334155] hover:text-[#1e88e5] cursor-pointer flex justify-between items-center border border-gray-100"
                >
                  <span className="truncate">{news.title}</span>
                  <span className="text-[10px] text-[#94a3b8] font-mono shrink-0 ml-2">{news.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 사업장 날씨 정보 (기존 100% 동일) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col hover:shadow-md transition">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-cloud-sun"></i>
                </div>
                <h3 className="font-extrabold text-[#1e293b] text-base">날씨 정보</h3>
              </div>
              <span className="text-[11px] font-bold text-[#94a3b8]">(08:50 기준)</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {/* 김해 */}
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-between">
                <span className="text-xs font-extrabold text-[#1e293b]">김해</span>
                <span className="text-[10px] text-blue-600 font-bold">어제기준 ▼ 1.5°</span>
                <i className="fa-solid fa-sun text-amber-500 text-2xl my-1.5"></i>
                <span className="text-base font-black text-[#1e293b]">28.9°C</span>
                <span className="text-[10px] text-[#64748b] font-bold">💧 73%</span>
                <span className="text-[10px] text-[#94a3b8]">체감온도 30.4°C</span>
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded mt-1">기상특보 없음</span>
                <span className="text-[9px] text-[#94a3b8] mt-1">내일 ☁️ 25° / 33°</span>
              </div>

              {/* 부산 */}
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-between">
                <span className="text-xs font-extrabold text-[#1e293b]">부산</span>
                <span className="text-[10px] text-blue-600 font-bold">어제기준 ▼ 0.6°</span>
                <i className="fa-solid fa-cloud text-slate-400 text-2xl my-1.5"></i>
                <span className="text-base font-black text-[#1e293b]">30.8°C</span>
                <span className="text-[10px] text-[#64748b] font-bold">💧 72%</span>
                <span className="text-[10px] text-[#94a3b8]">체감온도 32.3°C</span>
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded mt-1">기상특보 없음</span>
                <span className="text-[9px] text-[#94a3b8] mt-1">내일 ☁️ 26° / 33°</span>
              </div>

              {/* 창녕 */}
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-between">
                <span className="text-xs font-extrabold text-[#1e293b]">창녕</span>
                <span className="text-[10px] text-blue-600 font-bold">어제기준 ▼ 1.5°</span>
                <i className="fa-solid fa-sun text-amber-500 text-2xl my-1.5"></i>
                <span className="text-base font-black text-[#1e293b]">30.2°C</span>
                <span className="text-[10px] text-[#64748b] font-bold">💧 73%</span>
                <span className="text-[10px] text-[#94a3b8]">체감온도 31.8°C</span>
                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded mt-1">기상특보 없음</span>
                <span className="text-[9px] text-[#94a3b8] mt-1">내일 ☁️ 25° / 35°</span>
              </div>
            </div>
          </div>

        </section>

      </div>

      {/* 우측 하단 둥둥이 AI 챗봇 캐릭터 위젯 (기존 100% 동일) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <div className="bg-white px-3 py-1.5 rounded-2xl shadow-lg border border-gray-200 text-xs font-extrabold text-[#1e293b] animate-bounce">
          무엇이든 물어보세요
        </div>
        <button 
          onClick={() => openModal('안전보건 AI 챗봇 둥둥이', '산업안전보건법 및 위험성평가 규칙에 대해 궁금한 점을 적어주시면 AI가 즉시 답변해 드립니다.')}
          className="w-14 h-14 bg-[#1e88e5] hover:bg-[#1565c0] text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 transition hover:scale-110 active:scale-95"
        >
          <i className="fa-solid fa-robot text-2xl"></i>
        </button>
      </div>

      {/* 모달 팝업 */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-extrabold text-[#1e293b]">{modalTitle}</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed font-medium">
              {modalContent}
            </p>
            <div className="pt-2 text-right">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#1e88e5] text-white rounded-xl text-xs font-bold hover:bg-[#1565c0] transition"
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
