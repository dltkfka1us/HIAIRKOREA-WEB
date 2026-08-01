'use client';

import { useState, useEffect } from 'react';

export default function HomeDash({
  eduData,
  tbmData,
  legalData,
  notices,
  newsData,
  weatherData,
  openModal
}: any) {
  const [isSirenLoading, setIsSirenLoading] = useState(false);
  const [sirenCache, setSirenCache] = useState<any>(null);

  useEffect(() => {
    // 백그라운드에서 중대재해 사이렌 포스터 미리 불러오기 (캐싱)
    fetch('/api/siren')
      .then(res => res.json())
      .then(data => {
        if (data?.data) setSirenCache(data.data);
      })
      .catch(e => console.error("Siren prefetch err:", e));
  }, []);

  const getLocData = (locName: string, locArray: any[]) => {
    return locArray?.find(item => item.loc === locName) || { target: 0, done: 0, undone: 0, rate: 0 };
  };

  return (
    <div className="home-dashboard animate-in fade-in duration-300">
      
      {/* Row 1: 3 Main Cards */}
      <section className="home-grid-top">
        
        {/* 1. Education Status */}
        <div className="content-card kpi-dashboard-card border border-slate-200/80 shadow-sm rounded-[20px] bg-white overflow-hidden h-[340px] flex flex-col transition hover:shadow-md">
          <div className="card-header-simple p-3.5 px-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
            <div className="icon-box bg-emerald-50 w-9 h-9 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-graduation-cap text-emerald-500 text-base"></i>
            </div>
            <h4 className="font-black text-slate-800 flex-1 m-0 text-[15px] tracking-tight">
              정기안전교육 현황 <small className="text-slate-400 font-semibold text-xs ml-1">(금월 기준)</small>
            </h4>
          </div>

          <div className="home-card-content loaded p-4" id="home-edu-content">
            <div className="kpi-mini-row grid grid-cols-4 gap-2 mb-6">
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">대상</span>
                <span className="value block text-lg font-black text-slate-800">{eduData?.total?.target || 0}<small className="text-xs font-medium ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">이수</span>
                <span className="value block text-lg font-black text-emerald-500">{eduData?.total?.done || 0}<small className="text-xs font-medium ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">미이수</span>
                <span className="value block text-lg font-black text-rose-500">{eduData?.total?.undone || 0}<small className="text-xs font-medium ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">이수율</span>
                <span className="value block text-lg font-black text-blue-500">{eduData?.total?.rate || 0}<small className="text-xs font-medium ml-0.5">%</small></span>
              </div>
            </div>

            <div className="chart-gauge-row flex justify-around items-center">
              {['김해', '부산', '창녕'].map((loc, idx) => {
                const locData = eduData?.locations?.find((l: any) => l.loc === loc) || { pct: 0 };
                const pct = locData.pct;
                return (
                  <div key={loc} className="gauge-item flex flex-col items-center">
                    <div className="liq-gauge-wrap relative w-24 h-24 flex items-center justify-center">
                      <svg className="liq-progress-ring absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="liq-ring-bg" cx="50" cy="50" r="44" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                        <circle className="liq-ring-fill glow-green transition-all duration-1000" cx="50" cy="50" r="44" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" strokeDasharray="276.46" strokeDashoffset={276.46 - (pct/100)*276.46} />
                      </svg>
                      <div className="liq-tank-circle absolute w-[76px] h-[76px] rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center">
                        <div className="liq-val-circle absolute z-10 font-black text-base text-slate-800">{pct}<span className="liq-pct text-xs">%</span></div>
                        <div className="liq-fill-circle absolute bottom-0 w-full transition-all duration-1000 overflow-hidden" style={{ height: `${pct}%` }}>
                          <div className="liq-wave-anim-back"></div>
                          <div className="liq-solid-circle w-full h-full" style={{ background: 'linear-gradient(0deg,#059669,#10b981)' }}></div>
                          <div className="liq-wave-anim"></div>
                        </div>
                      </div>
                    </div>
                    <span className="gauge-label font-bold text-xs text-slate-600 mt-2">{loc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. TBM Status */}
        <div className="content-card kpi-dashboard-card border border-slate-200/80 shadow-sm rounded-[20px] bg-white overflow-hidden h-[340px] flex flex-col transition hover:shadow-md">
          <div className="card-header-simple p-3.5 px-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="icon-box bg-purple-50 w-9 h-9 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-comments text-purple-500 text-base"></i>
              </div>
              <h4 className="font-black text-slate-800 m-0 text-[15px] tracking-tight">
                TBM 현황 <small className="text-slate-400 font-semibold text-xs ml-1">(금일 기준)</small>
              </h4>
            </div>
            <span onClick={() => openModal(notices?.[0]?.title || '공지사항', notices?.[0]?.content || '내용이 없습니다.')} className="cursor-pointer bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5">
              <i className="fa-solid fa-bullhorn animate-pulse"></i> 공지사항
            </span>
          </div>

          <div className="home-card-content loaded p-4" id="home-tbm-content">
            <div className="kpi-mini-row grid grid-cols-4 gap-2 mb-6">
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">대상</span>
                <span className="value block text-lg font-black text-slate-800">{tbmData?.total?.target || 0}<small className="text-xs font-medium ml-0.5">팀</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">완료</span>
                <span className="value block text-lg font-black text-emerald-500">{tbmData?.total?.done || 0}<small className="text-xs font-medium ml-0.5">팀</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">미실시</span>
                <span className="value block text-lg font-black text-rose-500">{tbmData?.total?.undone || 0}<small className="text-xs font-medium ml-0.5">팀</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">실시율</span>
                <span className="value block text-lg font-black text-purple-500">{tbmData?.total?.rate || 0}<small className="text-xs font-medium ml-0.5">%</small></span>
              </div>
            </div>

            <div className="chart-gauge-row flex justify-around items-center">
              {['김해', '창녕'].map((loc, idx) => {
                const locItem = getLocData(loc, tbmData?.locations || []);
                const pct = locItem.pct || 0;
                return (
                  <div key={loc} className="gauge-item flex flex-col items-center">
                    <div className="liq-gauge-wrap relative w-24 h-24 flex items-center justify-center">
                      <svg className="liq-progress-ring absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="liq-ring-bg" cx="50" cy="50" r="44" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                        <circle className="liq-ring-fill glow-purple transition-all duration-1000" cx="50" cy="50" r="44" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" strokeDasharray="276.46" strokeDashoffset={276.46 - (pct/100)*276.46} />
                      </svg>
                      <div className="liq-tank-circle absolute w-[76px] h-[76px] rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center">
                        <div className="liq-val-circle absolute z-10 font-black text-base text-slate-800">{pct}<span className="liq-pct text-xs">%</span></div>
                        <div className="liq-fill-circle absolute bottom-0 w-full transition-all duration-1000 overflow-hidden" style={{ height: `${pct}%` }}>
                          <div className="liq-wave-anim-back"></div>
                          <div className="liq-solid-circle w-full h-full" style={{ background: 'linear-gradient(0deg,#7c3aed,#8b5cf6)' }}></div>
                          <div className="liq-wave-anim"></div>
                        </div>
                      </div>
                    </div>
                    <span className="gauge-label font-bold text-xs text-slate-600 mt-2">{loc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Legal Status */}
        <div className="content-card kpi-dashboard-card border border-slate-200/80 shadow-sm rounded-[20px] bg-white overflow-hidden flex flex-col h-[340px] transition hover:shadow-md">
          <div className="card-header-simple p-3.5 px-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
            <div className="icon-box bg-blue-50 w-9 h-9 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-gavel text-blue-500 text-base"></i>
            </div>
            <h4 className="font-black text-slate-800 flex-1 m-0 text-[15px] tracking-tight">
              법정의무교육 현황 <small className="text-slate-400 font-semibold text-xs ml-1">(금년 기준)</small>
            </h4>
          </div>

          <div className="home-card-content loaded p-4 flex flex-col flex-1 overflow-hidden" id="home-legal-content">
            <div className="kpi-mini-row grid grid-cols-4 gap-2 mb-4 shrink-0">
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">대상</span>
                <span className="value block text-lg font-black text-slate-800">{legalData?.total?.target || 0}<small className="text-xs font-medium ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">이수</span>
                <span className="value block text-lg font-black text-emerald-500">{legalData?.total?.done || 0}<small className="text-xs font-medium ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">미이수</span>
                <span className="value block text-lg font-black text-rose-500">{legalData?.total?.undone || 0}<small className="text-xs font-medium ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-slate-50 rounded-xl py-2">
                <span className="label block text-[11px] font-bold text-slate-500 mb-1">이수율</span>
                <span className="value block text-lg font-black text-blue-500">{legalData?.total?.rate || 0}<small className="text-xs font-medium ml-0.5">%</small></span>
              </div>
            </div>

            {/* Person Icons Visualiser (Legacy Screenshot Match) */}
            <div className="flex items-center justify-center gap-2 my-2 py-1 shrink-0 bg-slate-50/60 rounded-xl border border-gray-100">
              {Array.from({ length: Math.min(legalData?.total?.done || 3, 10) }).map((_, i) => (
                <i key={`done-${i}`} className="fa-solid fa-user-check text-[#3182f6] text-sm"></i>
              ))}
              {Array.from({ length: Math.min(legalData?.total?.undone || 7, 10) }).map((_, i) => (
                <i key={`undone-${i}`} className="fa-solid fa-user-xmark text-[#e53e3e] text-sm"></i>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 bg-slate-50 p-2.5 rounded-2xl border border-gray-100">
              {legalData?.officers?.map((officer: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px]">{officer.loc}</span>
                    <span className="font-bold text-slate-700">{officer.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${officer.isDanger ? 'text-rose-500' : 'text-amber-500'} font-extrabold text-[11px]`}>{officer.dday}</span>
                    <span className={`text-[10px] border ${officer.isDanger ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-amber-200 bg-amber-50 text-amber-600'} px-1.5 py-0.5 rounded font-bold`}>{officer.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Row 2: Info Grid */}
      <section className="home-grid-bottom mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* KOSHA News */}
        <div className="content-card list-card border border-slate-200/80 shadow-sm rounded-[20px] bg-white overflow-hidden flex flex-col h-[340px] transition hover:shadow-md">
          <div className="card-header-simple p-3.5 px-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="icon-box bg-rose-50 w-9 h-9 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-triangle-exclamation text-rose-500"></i>
              </div>
              <h4 className="font-black text-slate-800 m-0 text-[15px] tracking-tight">사고 속보</h4>
            </div>
            <span onClick={async () => {
              if (sirenCache) {
                openModal('중대재해 사이렌', '안전보건공단 중대재해 사이렌 게시판입니다.', 'https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01', sirenCache);
                return;
              }
              if (isSirenLoading) return;
              setIsSirenLoading(true);
              try {
                const res = await fetch('/api/siren');
                const data = await res.json();
                const fetchedData = data?.data || [];
                setSirenCache(fetchedData);
                openModal('중대재해 사이렌', '안전보건공단 중대재해 사이렌 게시판입니다.', 'https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01', fetchedData);
              } finally {
                setIsSirenLoading(false);
              }
            }} className="cursor-pointer text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded-lg border border-rose-100 flex items-center gap-1 transition">
              {isSirenLoading ? (
                <i className="fa-solid fa-spinner fa-spin text-rose-500"></i>
              ) : (
                <i className="fa-solid fa-bell animate-pulse text-rose-500"></i>
              )}
              {isSirenLoading ? ' 불러오는 중...' : ' 중대재해 사이렌'}
            </span>
          </div>
          <div className="scroll-list overflow-y-auto flex-1 bg-white">
            {newsData?.kosha?.map((item: any, i: number) => {
              const tagText = item.tag || '사망 1명';
              const locText = item.loc || '전국';

              return (
                <a key={i} href={item.link || '#'} onClick={(e) => { e.preventDefault(); openModal('사고 속보', item.text, item.link, item); }} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 hover:bg-slate-50 cursor-pointer transition group">
                  <span className="font-extrabold text-slate-800 text-[13px] truncate max-w-[80%] pr-2 group-hover:text-blue-600 transition-colors">
                    <span className="text-[#3182f6] font-extrabold mr-1">[{locText}]</span>
                    {item.text}
                  </span>
                  <span className="text-[13px] font-extrabold text-[#e53e3e] shrink-0">{tagText}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Safety News */}
        <div className="content-card list-card border border-slate-200/80 shadow-sm rounded-[20px] bg-white overflow-hidden flex flex-col h-[340px] transition hover:shadow-md">
          <div className="card-header-simple p-3.5 px-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
            <div className="icon-box bg-slate-100 w-9 h-9 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-newspaper text-slate-500"></i>
            </div>
            <h4 className="font-black text-slate-800 m-0 text-[15px] tracking-tight">최신 안전 뉴스</h4>
          </div>
          <div className="scroll-list overflow-y-auto flex-1 bg-white">
            {newsData?.safety?.map((news: any, i: number) => (
              <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center px-4 py-3 border-b border-gray-100 hover:bg-slate-50 cursor-pointer transition group">
                <span className="font-semibold text-slate-700 text-[13px] truncate max-w-[80%] group-hover:text-blue-600">{news.title}</span>
                <span className="text-[12px] font-semibold text-slate-400 shrink-0">{news.date}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="content-card weather-card border border-slate-200/80 shadow-sm rounded-[20px] bg-white overflow-hidden flex flex-col h-[340px] transition hover:shadow-md">
          <div className="card-header-simple p-3.5 px-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="icon-box bg-amber-50 w-9 h-9 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-cloud-sun text-amber-500"></i>
              </div>
              <h4 className="font-extrabold text-slate-800 m-0 text-base">날씨 정보</h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400">(실시간 기준)</span>
          </div>
          <div className="weather-grid-detailed grid grid-cols-3 gap-2 p-3 flex-1 bg-white">
            {weatherData?.map((weather: any) => (
              <div key={weather.loc} className="flex flex-col items-center text-center p-2 border-r last:border-r-0 border-gray-100">
                <a href={`https://search.naver.com/search.naver?query=${weather.loc}+날씨`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-800 mb-2 hover:text-blue-600 transition underline decoration-transparent hover:decoration-blue-600 underline-offset-4">
                  {weather.loc}
                </a>
                <span className="text-[10px] text-blue-500 font-bold mb-3">어제기준 {weather.diff}</span>
                
                <div className="flex items-center gap-2 mb-2">
                  <i className={`fa-solid ${weather.icon} ${weather.color} text-4xl drop-shadow-sm`}></i>
                  <span className="text-2xl font-extrabold text-slate-800 tracking-tighter">{weather.temp}°C</span>
                </div>
                
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-2">
                  <i className="fa-solid fa-droplet text-blue-400"></i> {weather.hum}%
                </div>
                
                <span className="text-[11px] font-semibold text-slate-500 mb-2">체감온도 {weather.feel}°C</span>
                
                <span className={`text-[11px] font-extrabold ${weather.alert === '기상특보 없음' ? 'text-emerald-500' : 'text-rose-500'} mb-3`}>
                  {weather.alert}
                </span>
                
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-auto pt-2 border-t border-gray-50 w-full justify-center">
                  내일 <i className="fa-solid fa-cloud text-slate-300"></i> {weather.tomorrow}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
