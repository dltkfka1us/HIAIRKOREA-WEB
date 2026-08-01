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
        <div className="content-card kpi-dashboard-card border border-slate-200/80 shadow-sm rounded-3xl bg-white overflow-hidden h-[385px] flex flex-col transition hover:shadow-xl hover:-translate-y-0.5">
          <div className="card-header-simple p-4 px-6 border-b border-slate-100 flex items-center gap-3 shrink-0 bg-slate-50/40">
            <div className="icon-box bg-emerald-50 text-emerald-600 border border-emerald-100/80 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
              <i className="fa-solid fa-graduation-cap text-lg"></i>
            </div>
            <h4 className="font-black text-slate-900 flex-1 m-0 text-base tracking-tight flex items-center justify-between">
              <span>정기안전교육 현황</span>
              <small className="text-slate-400 font-semibold text-xs bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">금월 기준</small>
            </h4>
          </div>

          <div className="home-card-content loaded p-5 flex-1 flex flex-col justify-between" id="home-edu-content">
            <div className="kpi-mini-row grid grid-cols-4 gap-2.5 mb-4">
              <div className="kpi-mini-item text-center bg-slate-50/80 border border-slate-200/60 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">대상</span>
                <span className="value block text-2xl font-black text-slate-800">{eduData?.total?.target || 0}<small className="text-xs font-bold text-slate-500 ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-emerald-50/50 border border-emerald-200/50 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-emerald-600 uppercase tracking-wider mb-0.5">이수</span>
                <span className="value block text-2xl font-black text-emerald-600">{eduData?.total?.done || 0}<small className="text-xs font-bold text-emerald-600 ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-rose-50/50 border border-rose-200/50 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-rose-600 uppercase tracking-wider mb-0.5">미이수</span>
                <span className="value block text-2xl font-black text-rose-600">{eduData?.total?.undone || 0}<small className="text-xs font-bold text-rose-600 ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-blue-50/50 border border-blue-200/50 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-blue-600 uppercase tracking-wider mb-0.5">이수율</span>
                <span className="value block text-2xl font-black text-blue-600">{eduData?.total?.rate || 0}<small className="text-xs font-bold text-blue-600 ml-0.5">%</small></span>
              </div>
            </div>

            <div className="chart-gauge-row flex justify-around items-center my-auto pb-1">
              {['김해', '부산', '창녕'].map((loc, idx) => {
                const locData = eduData?.locations?.find((l: any) => l.loc === loc) || { pct: 0 };
                const pct = locData.pct;
                return (
                  <div key={loc} className="gauge-item flex flex-col items-center">
                    <div className="liq-gauge-wrap relative w-[94px] h-[94px] flex items-center justify-center">
                      <svg className="liq-progress-ring absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="liq-ring-bg" cx="50" cy="50" r="43" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                        <circle className="liq-ring-fill glow-green transition-all duration-1000" cx="50" cy="50" r="43" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" strokeDasharray="270.17" strokeDashoffset={270.17 - (pct/100)*270.17} />
                      </svg>
                      <div className="liq-tank-circle absolute w-[76px] h-[76px] rounded-full overflow-hidden bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                        <div className="liq-val-circle absolute z-10 font-black text-base text-slate-900">{pct}<span className="liq-pct text-xs">%</span></div>
                        <div className="liq-fill-circle absolute bottom-0 w-full transition-all duration-1000 overflow-hidden" style={{ height: `${pct}%` }}>
                          <div className="liq-wave-anim-back"></div>
                          <div className="liq-solid-circle w-full h-full" style={{ background: 'linear-gradient(0deg,#059669,#10b981)' }}></div>
                          <div className="liq-wave-anim"></div>
                        </div>
                      </div>
                    </div>
                    <span className="gauge-label font-black text-xs text-slate-700 mt-2">{loc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. TBM Status */}
        <div className="content-card kpi-dashboard-card border border-slate-200/80 shadow-sm rounded-3xl bg-white overflow-hidden h-[385px] flex flex-col transition hover:shadow-xl hover:-translate-y-0.5">
          <div className="card-header-simple p-4 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/40">
            <div className="flex items-center gap-3">
              <div className="icon-box bg-purple-50 text-purple-600 border border-purple-100/80 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
                <i className="fa-solid fa-comments text-lg"></i>
              </div>
              <h4 className="font-black text-slate-900 m-0 text-base tracking-tight flex items-center gap-2">
                <span>TBM 현황</span>
                <small className="text-slate-400 font-semibold text-xs bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">금일 기준</small>
              </h4>
            </div>
            <span onClick={() => openModal(notices?.[0]?.title || '공지사항', notices?.[0]?.content || '내용이 없습니다.')} className="cursor-pointer bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200/70 px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs">
              <i className="fa-solid fa-bullhorn animate-pulse"></i> 공지사항
            </span>
          </div>

          <div className="home-card-content loaded p-5 flex-1 flex flex-col justify-between" id="home-tbm-content">
            <div className="kpi-mini-row grid grid-cols-4 gap-2.5 mb-4">
              <div className="kpi-mini-item text-center bg-slate-50/80 border border-slate-200/60 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">대상</span>
                <span className="value block text-2xl font-black text-slate-800">{tbmData?.total?.target || 0}<small className="text-xs font-bold text-slate-500 ml-0.5">팀</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-emerald-50/50 border border-emerald-200/50 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-emerald-600 uppercase tracking-wider mb-0.5">완료</span>
                <span className="value block text-2xl font-black text-emerald-600">{tbmData?.total?.done || 0}<small className="text-xs font-bold text-emerald-600 ml-0.5">팀</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-rose-50/50 border border-rose-200/50 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-rose-600 uppercase tracking-wider mb-0.5">미실시</span>
                <span className="value block text-2xl font-black text-rose-600">{tbmData?.total?.undone || 0}<small className="text-xs font-bold text-rose-600 ml-0.5">팀</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-purple-50/50 border border-purple-200/50 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-purple-600 uppercase tracking-wider mb-0.5">실시율</span>
                <span className="value block text-2xl font-black text-purple-600">{tbmData?.total?.rate || 0}<small className="text-xs font-bold text-purple-600 ml-0.5">%</small></span>
              </div>
            </div>

            <div className="chart-gauge-row flex justify-around items-center my-auto pb-1">
              {['김해', '창녕'].map((loc, idx) => {
                const locItem = getLocData(loc, tbmData?.locations || []);
                const pct = locItem.pct || 0;
                return (
                  <div key={loc} className="gauge-item flex flex-col items-center">
                    <div className="liq-gauge-wrap relative w-[94px] h-[94px] flex items-center justify-center">
                      <svg className="liq-progress-ring absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="liq-ring-bg" cx="50" cy="50" r="43" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                        <circle className="liq-ring-fill glow-purple transition-all duration-1000" cx="50" cy="50" r="43" fill="none" stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" strokeDasharray="270.17" strokeDashoffset={270.17 - (pct/100)*270.17} />
                      </svg>
                      <div className="liq-tank-circle absolute w-[76px] h-[76px] rounded-full overflow-hidden bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                        <div className="liq-val-circle absolute z-10 font-black text-base text-slate-900">{pct}<span className="liq-pct text-xs">%</span></div>
                        <div className="liq-fill-circle absolute bottom-0 w-full transition-all duration-1000 overflow-hidden" style={{ height: `${pct}%` }}>
                          <div className="liq-wave-anim-back"></div>
                          <div className="liq-solid-circle w-full h-full" style={{ background: 'linear-gradient(0deg,#7c3aed,#8b5cf6)' }}></div>
                          <div className="liq-wave-anim"></div>
                        </div>
                      </div>
                    </div>
                    <span className="gauge-label font-black text-xs text-slate-700 mt-2">{loc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Legal Status */}
        <div className="content-card kpi-dashboard-card border border-slate-200/80 shadow-sm rounded-3xl bg-white overflow-hidden h-[385px] flex flex-col transition hover:shadow-xl hover:-translate-y-0.5">
          <div className="card-header-simple p-4 px-6 border-b border-slate-100 flex items-center gap-3 shrink-0 bg-slate-50/40">
            <div className="icon-box bg-blue-50 text-blue-600 border border-blue-100/80 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
              <i className="fa-solid fa-gavel text-lg"></i>
            </div>
            <h4 className="font-black text-slate-900 flex-1 m-0 text-base tracking-tight flex items-center justify-between">
              <span>법정의무교육 현황</span>
              <small className="text-slate-400 font-semibold text-xs bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">금년 기준</small>
            </h4>
          </div>

          <div className="home-card-content loaded p-5 flex flex-col flex-1 overflow-hidden" id="home-legal-content">
            <div className="kpi-mini-row grid grid-cols-4 gap-2.5 mb-3 shrink-0">
              <div className="kpi-mini-item text-center bg-slate-50/80 border border-slate-200/60 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">대상</span>
                <span className="value block text-2xl font-black text-slate-800">{legalData?.total?.target || 0}<small className="text-xs font-bold text-slate-500 ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-emerald-50/50 border border-emerald-200/50 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-emerald-600 uppercase tracking-wider mb-0.5">이수</span>
                <span className="value block text-2xl font-black text-emerald-600">{legalData?.total?.done || 0}<small className="text-xs font-bold text-emerald-600 ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-rose-50/50 border border-rose-200/50 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-rose-600 uppercase tracking-wider mb-0.5">미이수</span>
                <span className="value block text-2xl font-black text-rose-600">{legalData?.total?.undone || 0}<small className="text-xs font-bold text-rose-600 ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-blue-50/50 border border-blue-200/50 rounded-2xl py-3 shadow-inner">
                <span className="label block text-[11px] font-black text-blue-600 uppercase tracking-wider mb-0.5">이수율</span>
                <span className="value block text-2xl font-black text-blue-600">{legalData?.total?.rate || 0}<small className="text-xs font-bold text-blue-600 ml-0.5">%</small></span>
              </div>
            </div>

            {/* Person Icons Visualiser */}
            <div className="flex items-center justify-center gap-2 my-2 py-2 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl">
              {Array.from({ length: Math.min(legalData?.total?.done || 3, 10) }).map((_, i) => (
                <i key={`done-${i}`} className="fa-solid fa-user-check text-blue-600 text-sm"></i>
              ))}
              {Array.from({ length: Math.min(legalData?.total?.undone || 7, 10) }).map((_, i) => (
                <i key={`undone-${i}`} className="fa-solid fa-user-xmark text-rose-500 text-sm"></i>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
              {legalData?.officers?.map((officer: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 px-3 bg-white rounded-xl border border-slate-200/70 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-extrabold text-[11px]">{officer.loc}</span>
                    <span className="font-extrabold text-slate-800 text-[13px]">{officer.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${officer.isDanger ? 'text-rose-600' : 'text-amber-600'} font-black text-xs`}>{officer.dday}</span>
                    <span className={`text-[11px] border ${officer.isDanger ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-amber-200 bg-amber-50 text-amber-600'} px-2 py-0.5 rounded-lg font-black`}>{officer.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Row 2: Info Grid */}
      <section className="home-grid-bottom mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOSHA News */}
        <div className="content-card list-card border border-slate-200/80 shadow-sm rounded-3xl bg-white overflow-hidden flex flex-col h-[385px] transition hover:shadow-xl hover:-translate-y-0.5">
          <div className="card-header-simple p-4 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/40">
            <div className="flex items-center gap-3">
              <div className="icon-box bg-rose-50 text-rose-600 border border-rose-100/80 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
                <i className="fa-solid fa-triangle-exclamation text-lg"></i>
              </div>
              <h4 className="font-black text-slate-900 m-0 text-base tracking-tight">사고 속보</h4>
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
            }} className="cursor-pointer text-xs font-black bg-rose-50 hover:bg-rose-100 border border-rose-200/70 text-rose-600 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs">
              {isSirenLoading ? (
                <i className="fa-solid fa-spinner fa-spin text-rose-500"></i>
              ) : (
                <i className="fa-solid fa-bell animate-pulse text-rose-500"></i>
              )}
              {isSirenLoading ? ' 불러오는 중...' : ' 중대재해 사이렌'}
            </span>
          </div>
          <div className="scroll-list overflow-y-auto flex-1 bg-white divide-y divide-slate-100">
            {newsData?.kosha?.map((item: any, i: number) => {
              const tagText = item.tag || '사망 1명';
              const locText = item.loc || '전국';

              return (
                <a key={i} href={item.link || '#'} onClick={(e) => { e.preventDefault(); openModal('사고 속보', item.text, item.link, item); }} className="flex justify-between items-center p-4 px-5 hover:bg-slate-50/80 cursor-pointer transition group">
                  <span className="font-extrabold text-slate-800 text-[13.5px] truncate max-w-[78%] pr-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-600 border border-blue-200/80 font-black px-2 py-0.5 rounded-md text-xs shrink-0">[{locText}]</span>
                    <span className="truncate">{item.text}</span>
                  </span>
                  <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-lg shrink-0 shadow-xs">{tagText}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Safety News */}
        <div className="content-card list-card border border-slate-200/80 shadow-sm rounded-3xl bg-white overflow-hidden flex flex-col h-[385px] transition hover:shadow-xl hover:-translate-y-0.5">
          <div className="card-header-simple p-4 px-6 border-b border-slate-100 flex items-center gap-3 shrink-0 bg-slate-50/40">
            <div className="icon-box bg-slate-100 text-slate-700 border border-slate-200/80 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
              <i className="fa-solid fa-newspaper text-lg"></i>
            </div>
            <h4 className="font-black text-slate-900 m-0 text-base tracking-tight">최신 안전 뉴스</h4>
          </div>
          <div className="scroll-list overflow-y-auto flex-1 bg-white divide-y divide-slate-100">
            {newsData?.safety?.map((news: any, i: number) => (
              <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center p-4 px-5 hover:bg-slate-50/80 cursor-pointer transition group">
                <span className="font-extrabold text-slate-800 text-[13.5px] truncate max-w-[78%] group-hover:text-blue-600 transition-colors">{news.title}</span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md shrink-0">{news.date}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="content-card weather-card border border-slate-200/80 shadow-sm rounded-3xl bg-white overflow-hidden flex flex-col h-[385px] transition hover:shadow-xl hover:-translate-y-0.5">
          <div className="card-header-simple p-4 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/40">
            <div className="flex items-center gap-3">
              <div className="icon-box bg-amber-50 text-amber-600 border border-amber-100/80 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs">
                <i className="fa-solid fa-cloud-sun text-lg"></i>
              </div>
              <h4 className="font-black text-slate-900 m-0 text-base tracking-tight">날씨 정보</h4>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">실시간 기준</span>
          </div>
          <div className="weather-grid-detailed grid grid-cols-3 divide-x divide-slate-100 p-3 flex-1 bg-white">
            {weatherData?.map((weather: any) => (
              <div key={weather.loc} className="flex flex-col items-center justify-between text-center px-2 py-2 h-full">
                <a href={`https://search.naver.com/search.naver?query=${weather.loc}+날씨`} target="_blank" rel="noopener noreferrer" className="text-base font-black text-slate-900 hover:text-blue-600 transition underline decoration-transparent hover:decoration-blue-600 underline-offset-4">
                  {weather.loc}
                </a>
                
                <span className="text-[11px] text-blue-600 font-extrabold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full my-0.5">어제 {weather.diff}</span>
                
                <i className={`fa-solid ${weather.icon} ${weather.color} text-4xl drop-shadow-md my-2`}></i>
                
                <span className="text-3xl font-black text-slate-900 tracking-tight my-1">{weather.temp}°C</span>
                
                <div className="flex items-center gap-1 text-xs font-bold text-slate-500 my-0.5">
                  <i className="fa-solid fa-droplet text-blue-400"></i> {weather.hum}%
                </div>
                
                <span className="text-xs font-semibold text-slate-500 my-0.5">체감온도 {weather.feel}°C</span>
                
                <span className={`text-xs font-black ${weather.alert === '기상특보 없음' ? 'text-emerald-600 bg-emerald-50 border-emerald-200/80' : 'text-rose-600 bg-rose-50 border-rose-200/80'} border px-2.5 py-0.5 rounded-full my-1`}>
                  {weather.alert}
                </span>
                
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mt-auto pt-2 border-t border-slate-100 w-full justify-center">
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
