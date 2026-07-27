'use client';

import { useState, useEffect } from 'react';
import { getEduStats, getTbmStats, getLegalStats, getNotices } from '@/lib/actions/home.actions';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('HOME');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  // 상태 데이터
  const [eduData, setEduData] = useState<any>(null);
  const [tbmData, setTbmData] = useState<any>(null);
  const [legalData, setLegalData] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [newsData, setNewsData] = useState<any>({ kosha: [], safety: [] });
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 패칭
  useEffect(() => {
    async function loadData() {
      try {
        const [edu, tbm, legal, noticeList, weatherRes, newsRes] = await Promise.all([
          getEduStats('2026-07'),
          getTbmStats('2026-07-27'),
          getLegalStats(2026),
          getNotices(),
          fetch('/api/external?type=weather'),
          fetch('/api/external?type=news')
        ]);

        setEduData(edu);
        setTbmData(tbm);
        setLegalData(legal);
        setNotices(noticeList);
        
        if (weatherRes.ok) setWeatherData(await weatherRes.json());
        if (newsRes.ok) setNewsData(await newsRes.json());

      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const openModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setActiveModal('notice');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#1e88e5] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-[#64748b]">대시보드 데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-4 md:p-8 text-[#2c3e50] font-sans relative">
      <div className="max-w-[1400px] mx-auto space-y-5">
        
        {/* Row 0: Original Header (Branding & Slogan & Non-Disaster Counter) */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-2 gap-4">
          <div className="flex items-center gap-3">
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

            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl my-4 text-center">
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">대상</div>
                <div className="text-base font-black text-[#1e293b]">{eduData?.total.target}<small className="text-xs font-normal">명</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">이수</div>
                <div className="text-base font-black text-emerald-600">{eduData?.total.done}<small className="text-xs font-normal">명</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">미이수</div>
                <div className="text-base font-black text-rose-500">{eduData?.total.undone}<small className="text-xs font-normal">명</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">이수율</div>
                <div className="text-base font-black text-[#1e88e5]">{eduData?.total.rate}<small className="text-xs font-normal">%</small></div>
              </div>
            </div>

            <div className="flex justify-around items-center pt-1 text-center">
              {eduData?.locations.map((item: any) => (
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
                onClick={() => openModal(notices[0]?.title || '공지사항', notices[0]?.content || '내용이 없습니다.')}
                className="px-2.5 py-1 bg-purple-50 text-purple-600 hover:bg-purple-100 text-xs font-bold rounded-lg transition border border-purple-200/50 flex items-center gap-1"
              >
                <i className="fa-solid fa-bullhorn text-xs"></i> 공지사항
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl my-4 text-center">
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">대상</div>
                <div className="text-base font-black text-[#1e293b]">{tbmData?.total.target}<small className="text-xs font-normal">팀</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">완료</div>
                <div className="text-base font-black text-emerald-600">{tbmData?.total.done}<small className="text-xs font-normal">팀</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">미실시</div>
                <div className="text-base font-black text-rose-500">{tbmData?.total.undone}<small className="text-xs font-normal">팀</small></div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748b]">실시율</div>
                <div className="text-base font-black text-purple-600">{tbmData?.total.rate}<small className="text-xs font-normal">%</small></div>
              </div>
            </div>

            <div className="flex justify-around items-center pt-1 text-center">
              {tbmData?.locations.map((item: any) => (
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

          {/* 3. 법정의무교육 현황 (사람 아이콘 + 자격 D-Day 리스트) */}
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
                  <div className="text-base font-black text-[#1e293b]">{legalData?.total.target}<small className="text-xs font-normal">명</small></div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">이수</div>
                  <div className="text-base font-black text-emerald-600">{legalData?.total.done}<small className="text-xs font-normal">명</small></div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">미이수</div>
                  <div className="text-base font-black text-rose-500">{legalData?.total.undone}<small className="text-xs font-normal">명</small></div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">이수율</div>
                  <div className="text-base font-black text-[#1e88e5]">{legalData?.total.rate}<small className="text-xs font-normal">%</small></div>
                </div>
              </div>

              <div className="flex justify-center items-center gap-1.5 py-1 text-sm">
                {legalData?.avatars.map((isDone: boolean, idx: number) => (
                  <i key={idx} className={`fa-solid ${isDone ? 'fa-user-check text-blue-500' : 'fa-user-xmark text-rose-500'}`}></i>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-2xl border border-gray-100 max-h-32 overflow-y-auto">
              {legalData?.officers.map((officer: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-1.5 bg-white rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-bold text-[10px]">{officer.loc}</span>
                    <span className="font-bold text-[#334155] text-xs">{officer.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${officer.isDanger ? 'text-rose-500' : 'text-orange-500'} font-extrabold text-[11px]`}>{officer.dday}</span>
                    <span className={`text-[10px] border ${officer.isDanger ? 'border-rose-300 text-rose-600' : 'border-orange-300 text-orange-600'} px-1.5 py-0.5 rounded font-mono`}>{officer.date}</span>
                  </div>
                </div>
              ))}
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
              {newsData.kosha.map((item: any, idx: number) => (
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
              {newsData.safety.map((news: any, idx: number) => (
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

          {/* 3. 사업장 날씨 정보 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col hover:shadow-md transition">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-lg">
                  <i className="fa-solid fa-cloud-sun"></i>
                </div>
                <h3 className="font-extrabold text-[#1e293b] text-base">날씨 정보</h3>
              </div>
              <span className="text-[11px] font-bold text-[#94a3b8]">(실시간 기준)</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {weatherData.map((weather: any) => (
                <div key={weather.loc} className="p-2.5 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-between">
                  <span className="text-xs font-extrabold text-[#1e293b]">{weather.loc}</span>
                  <span className="text-[10px] text-blue-600 font-bold">어제기준 {weather.diff}</span>
                  <i className={`fa-solid ${weather.icon} ${weather.color} text-2xl my-1.5`}></i>
                  <span className="text-base font-black text-[#1e293b]">{weather.temp}°C</span>
                  <span className="text-[10px] text-[#64748b] font-bold">💧 {weather.hum}%</span>
                  <span className="text-[10px] text-[#94a3b8]">체감온도 {weather.feel}°C</span>
                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded mt-1">{weather.alert}</span>
                  <span className="text-[9px] text-[#94a3b8] mt-1">내일 ☁️ {weather.tomorrow}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

      </div>

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
