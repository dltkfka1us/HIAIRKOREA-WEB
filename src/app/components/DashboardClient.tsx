'use client';

import { useState, useEffect } from 'react';
import EduDash from './EduDash';
import HomeDash from './HomeDash';

const SLOGANS = [
  "안전은 타협할 수 없는 최고의 가치입니다.",
  "안전은 누가 보는 곳이 아니라 내 마음에서 시작됩니다.",
  "실수는 되돌릴 수 있지만 사고는 되돌릴 수 없습니다.",
  "서두르는 1분보다 확인하는 5초가 더 빠릅니다.",
  "안전의 완성은 보호구 착용에서 시작됩니다.",
  "작업 전 TBM은 사고를 막는 가장 확실한 예방입니다.",
  "설마 하는 '아차사고' 다시 보면 '중대재해'의 신호입니다.",
  "쾌적한 작업 환경은 우리 모두가 함께 만듭니다.",
  "모르는 위험은 사고가 되고 아는 위험은 예방이 됩니다.",
  "세상에서 가장 소중한 가치는 바로 당신의 생명입니다.",
  "가장 완벽한 작업은 사고 없이 가족의 품으로 돌아가는 것입니다.",
  "동료의 불안전한 행동을 지적하는 것은 배려이자 사랑입니다.",
  "안전은 나를 위한 약속이자 가족을 위한 책임입니다.",
  "안전은 선택이 아니라 우리가 지켜야 할 의무입니다.",
  "원칙을 지키는 당신이 우리 회사의 진정한 전문가입니다.",
  "안전에는 베테랑이 없습니다.",
  "예고 없는 사고를 막는 유일한 방법은 예방뿐입니다.",
  "안전은 내가 먼저, 실천은 지금 즉시!",
  "가벼운 스트레칭 5분으로 근골격계 질환을 예방할 수 있습니다.",
  "서로에게 건네는 격려 한마디가 마음을 지키는 가장 따뜻한 보호구입니다."
];

export default function DashboardClient({
  initialData,
}: {
  initialData: {
    eduData: any;
    tbmData: any;
    legalData: any;
    notices: any[];
    weatherData: any[];
    newsData: any;
  };
}) {
  const [activeTab, setActiveTab] = useState('HOME');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalLink, setModalLink] = useState<string | null>(null);
  const [modalExtra, setModalExtra] = useState<any>(null);
  const [sirenIndex, setSirenIndex] = useState(0);
  const [currentSlogan, setCurrentSlogan] = useState(SLOGANS[0]);

  useEffect(() => {
    setCurrentSlogan(SLOGANS[Math.floor(Math.random() * SLOGANS.length)]);
    document.documentElement.style.zoom = '1';
  }, []);

  const { eduData, tbmData, legalData, notices, weatherData, newsData } = initialData;

  const openModal = (title: string, content: string, link?: string, extraData?: any) => {
    setModalTitle(title);
    setModalContent(content);
    setModalLink(link || null);
    setModalExtra(extraData || null);
    if (title === '중대재해 사이렌') setSirenIndex(0);
    setActiveModal('notice');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-3 md:p-5 lg:p-6 text-[#2c3e50] relative">
      <div className="max-w-[1500px] w-full mx-auto space-y-4">
        
        {/* Row 0: Original Legacy Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-1 gap-3 relative">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
            <div className="flex items-center gap-3 shrink-0">
              <img src="https://i.imgur.com/8wvWwyX.png" alt="Company Logo" className="h-[34px] object-contain" />
              <h1 className="text-[1.2rem] font-extrabold text-[#1e293b] tracking-tight">
                Safety and Health Management System
              </h1>
            </div>
            
            {/* Separator & Slogan */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="w-[1px] h-4 bg-gray-300"></div>
              <div className="text-[13px] font-medium text-slate-500 whitespace-nowrap">
                {currentSlogan}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 ml-auto">
            {/* Non-Disaster Counter */}
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200/80 shadow-sm">
              <span className="text-xs font-semibold text-[#64748b]">무재해</span>
              <div className="flex gap-1 text-sm font-bold font-mono">
                <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded">1</span>
                <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded">9</span>
                <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded">7</span>
                <span className="bg-[#1e293b] text-white px-2 py-0.5 rounded">4</span>
              </div>
              <span className="text-xs font-semibold text-[#1e293b]">일</span>
            </div>

            {/* Utility Icons */}
            <div className="flex items-center gap-1 text-[#64748b] text-sm bg-white p-1.5 px-2 rounded-xl border border-gray-200/80 shadow-sm">
              <button title="시약 관리" className="p-1.5 hover:text-[#1e88e5] hover:bg-slate-50 rounded-lg transition"><i className="fa-solid fa-flask text-slate-600 text-sm"></i></button>
              <button title="일정 관리" className="p-1.5 hover:text-[#1e88e5] hover:bg-slate-50 rounded-lg transition"><i className="fa-solid fa-calendar-days text-slate-600 text-sm"></i></button>
              <button title="즐겨찾기" className="p-1.5 hover:text-[#1e88e5] hover:bg-slate-50 rounded-lg transition"><i className="fa-solid fa-bookmark text-slate-600 text-base"></i></button>
              <button onClick={() => openModal('관리자 로그인', '관리자 전용 인증 화면입니다.')} title="관리자 로그인" className="p-1.5 hover:text-[#1e88e5] hover:bg-slate-50 rounded-lg transition"><i className="fa-solid fa-key text-slate-600 text-sm"></i></button>
            </div>
          </div>
        </header>

        {/* Row 0.5: Legacy Navigation Bar */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#1e88e5] text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-xs`}></i>
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'HOME' && (
          <HomeDash
            eduData={eduData}
            tbmData={tbmData}
            legalData={legalData}
            notices={notices}
            newsData={newsData}
            weatherData={weatherData}
            openModal={openModal}
          />
        )}

        {activeTab === 'EDU' && <EduDash />}

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
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 outline-none focus:outline-none" 
          tabIndex={0}
          autoFocus
          onKeyDown={(e) => {
            if (modalTitle === '중대재해 사이렌' && Array.isArray(modalExtra)) {
              if (e.key === 'ArrowRight') setSirenIndex((prev) => (prev + 1) % modalExtra.length);
              if (e.key === 'ArrowLeft') setSirenIndex((prev) => (prev - 1 + modalExtra.length) % modalExtra.length);
            }
            if (e.key === 'Escape') setActiveModal(null);
          }}
        >
          {modalTitle === '사고 속보' && modalExtra ? (
            /* KOSHA Accident News Modern Sleek Modal */
            <div className="bg-white rounded-3xl p-6 md:p-7 max-w-[500px] w-full shadow-2xl space-y-5 border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 border border-rose-100/80 rounded-2xl flex items-center justify-center shadow-xs">
                    <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">사고 속보</h3>
                      <span className="bg-rose-50 text-rose-600 border border-rose-200/80 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">LIVE</span>
                    </div>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5">안전보건공단 KOSHA 실시간 재해 정보</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>

              {/* 4 Key KPI Grid Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <i className="fa-regular fa-clock text-slate-400"></i> 발생일시
                  </p>
                  <p className="text-sm font-black text-slate-800">{modalExtra.timeInfo || '-'}</p>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <i className="fa-solid fa-location-dot text-slate-400"></i> 발생장소
                  </p>
                  <p className="text-sm font-black text-slate-800 truncate">{modalExtra.fullLoc || modalExtra.loc || '-'}</p>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <i className="fa-solid fa-[#1e88e5] fa-circle-info text-blue-500"></i> 사고형태
                  </p>
                  <p className="text-sm font-black text-slate-800">{modalExtra.type || '-'}</p>
                </div>

                <div className="bg-rose-50/80 rounded-2xl p-3.5 border border-rose-200/80">
                  <p className="text-[11px] font-extrabold text-rose-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <i className="fa-solid fa-[#e53e3e] fa-[#e53e3e] fa-user-slash text-rose-500"></i> 피해현황
                  </p>
                  <p className="text-sm font-black text-rose-600">{modalExtra.casualty || '-'}</p>
                </div>
              </div>

              {/* Detailed Summary Text */}
              <div className="space-y-1.5">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-align-left text-slate-400"></i> 재해 상세 개요
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[14px] leading-relaxed text-slate-800 font-bold tracking-tight">{modalContent}</p>
                </div>
              </div>

              {/* Action Link CTA Button */}
              {modalLink && (
                <a 
                  href={modalLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-center rounded-2xl font-black text-sm shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-2 active:scale-[0.98]" 
                  onClick={() => setActiveModal(null)}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i> KOSHA 원문 게시물 이동
                </a>
              )}
            </div>
          ) : modalTitle === '중대재해 사이렌' ? (
            /* KOSHA Siren Poster Modal */
            <div className="relative max-w-[600px] w-full bg-transparent flex flex-col items-center animate-in zoom-in-95 duration-200">
              <button onClick={() => setActiveModal(null)} className="absolute -top-12 right-0 z-50 w-10 h-10 text-white flex items-center justify-center text-3xl font-light hover:text-gray-300 transition outline-none">✕</button>
              
              <div className="absolute top-1/2 -left-12 -translate-y-1/2">
                <button onClick={(e) => { e.stopPropagation(); setSirenIndex((prev) => (prev - 1 + (modalExtra?.length || 1)) % (modalExtra?.length || 1)); }} className="text-white/70 hover:text-white text-5xl font-light transition">&lt;</button>
              </div>
              <div className="absolute top-1/2 -right-12 -translate-y-1/2">
                <button onClick={(e) => { e.stopPropagation(); setSirenIndex((prev) => (prev + 1) % (modalExtra?.length || 1)); }} className="text-white/70 hover:text-white text-5xl font-light transition">&gt;</button>
              </div>

              {Array.isArray(modalExtra) && modalExtra.length > 0 ? (
                <div className="w-full relative group rounded-[16px] overflow-hidden shadow-2xl">
                  <img src={modalExtra[sirenIndex].imgSrc} alt="Siren Poster" className="w-full h-auto object-contain bg-white" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur text-white px-5 py-3 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-300 shadow-xl border border-white/20">
                    <i className="fa-solid fa-hand-pointer animate-pulse"></i>
                    <span className="font-bold text-sm tracking-wide">키보드 좌우 스와이프</span>
                  </div>
                  <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1.5">
                    {modalExtra.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === sirenIndex ? 'w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'w-1.5 bg-white/40'}`}></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-3xl w-full">
                  <p className="text-slate-600 font-bold mb-4">현재 제공되는 포스터가 없습니다.</p>
                  {modalLink && <a href={modalLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#1e88e5] text-white rounded-xl font-bold hover:bg-[#1565c0]">게시판으로 이동</a>}
                </div>
              )}
            </div>
          ) : (
            /* Default Basic Modal */
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
              <p className="text-sm text-[#475569] leading-relaxed font-medium whitespace-pre-wrap">
                {modalContent}
              </p>
              <div className="pt-2 flex justify-end gap-2">
                {modalLink && (
                  <a 
                    href={modalLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                    onClick={() => setActiveModal(null)}
                  >
                    게시물 보러가기
                  </a>
                )}
                <button 
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 bg-[#1e88e5] text-white rounded-xl text-xs font-bold hover:bg-[#1565c0] transition"
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
