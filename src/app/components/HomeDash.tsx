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
      {/* Row 1: 3 Toss Minimal Cards */}
      <section className="home-grid-top">
        
        {/* 1. Education Status */}
        <div className="content-card kpi-dashboard-card bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-[360px] flex flex-col justify-between border border-slate-100 transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="pro-card-header -mx-6 -mt-6 p-4 px-6 bg-slate-50/70 rounded-t-3xl border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <h4 className="font-extrabold text-slate-800 m-0 text-[15px] tracking-tight">정기안전교육 현황</h4>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs">금월 기준</span>
          </div>

          <div className="home-card-content loaded flex-1 flex flex-col justify-between pt-4" id="home-edu-content">
            <div className="kpi-mini-row grid grid-cols-4 gap-2 mb-3">
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">대상</span>
                <span className="value block text-xl font-extrabold text-[#191f28]">{eduData?.total?.target || 0}<small className="text-xs font-medium text-[#6b7684] ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">이수</span>
                <span className="value block text-xl font-extrabold text-[#3182f6]">{eduData?.total?.done || 0}<small className="text-xs font-medium text-[#3182f6] ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">미이수</span>
                <span className="value block text-xl font-extrabold text-[#f04452]">{eduData?.total?.undone || 0}<small className="text-xs font-medium text-[#f04452] ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">이수율</span>
                <span className="value block text-xl font-extrabold text-[#191f28]">{eduData?.total?.rate || 0}<small className="text-xs font-medium text-[#6b7684] ml-0.5">%</small></span>
              </div>
            </div>

            <div className="chart-gauge-row flex justify-around items-center my-auto pb-1">
              {['김해', '부산', '창녕'].map((loc, idx) => {
                const locData = eduData?.locations?.find((l: any) => l.loc === loc) || { pct: 0 };
                const pct = locData.pct;
                return (
                  <div key={loc} className="gauge-item flex flex-col items-center">
                    <div className="liq-gauge-wrap relative w-[86px] h-[86px] flex items-center justify-center">
                      <svg className="liq-progress-ring absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="liq-ring-bg" cx="50" cy="50" r="43" fill="none" stroke="#f2f4f6" strokeWidth="7" />
                        <circle className="liq-ring-fill transition-all duration-1000" cx="50" cy="50" r="43" fill="none" stroke="#3182f6" strokeWidth="7" strokeLinecap="round" strokeDasharray="270.17" strokeDashoffset={270.17 - (pct/100)*270.17} />
                      </svg>
                      <div className="liq-tank-circle absolute w-[68px] h-[68px] rounded-full overflow-hidden bg-white shadow-xs flex items-center justify-center">
                        <div className="liq-val-circle absolute z-10 font-bold text-sm text-[#191f28]">{pct}<span className="liq-pct text-xs">%</span></div>
                        <div className="liq-fill-circle absolute bottom-0 w-full transition-all duration-1000 overflow-hidden" style={{ height: `${pct}%` }}>
                          <div className="liq-solid-circle w-full h-full" style={{ background: '#3182f6', opacity: 0.15 }}></div>
                        </div>
                      </div>
                    </div>
                    <span className="gauge-label font-semibold text-xs text-[#4e5968] mt-2">{loc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. TBM Status */}
        <div className="content-card kpi-dashboard-card bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-[360px] flex flex-col justify-between border border-slate-100 transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="pro-card-header -mx-6 -mt-6 p-4 px-6 bg-slate-50/70 rounded-t-3xl border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-sm shadow-md shadow-purple-500/20">
                <i className="fa-solid fa-comments"></i>
              </div>
              <h4 className="font-extrabold text-slate-800 m-0 text-[15px] tracking-tight">TBM 현황</h4>
            </div>
            <span onClick={() => openModal(notices?.[0]?.title || '공지사항', notices?.[0]?.content || '내용이 없습니다.')} className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs">
              <i className="fa-solid fa-bullhorn text-xs"></i> 공지사항
            </span>
          </div>

          <div className="home-card-content loaded flex-1 flex flex-col justify-between pt-4" id="home-tbm-content">
            <div className="kpi-mini-row grid grid-cols-4 gap-2 mb-3">
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">대상</span>
                <span className="value block text-xl font-extrabold text-[#191f28]">{tbmData?.total?.target || 0}<small className="text-xs font-medium text-[#6b7684] ml-0.5">팀</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">완료</span>
                <span className="value block text-xl font-extrabold text-[#3182f6]">{tbmData?.total?.done || 0}<small className="text-xs font-medium text-[#3182f6] ml-0.5">팀</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">미실시</span>
                <span className="value block text-xl font-extrabold text-[#f04452]">{tbmData?.total?.undone || 0}<small className="text-xs font-medium text-[#f04452] ml-0.5">팀</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">실시율</span>
                <span className="value block text-xl font-extrabold text-[#191f28]">{tbmData?.total?.rate || 0}<small className="text-xs font-medium text-[#6b7684] ml-0.5">%</small></span>
              </div>
            </div>

            <div className="chart-gauge-row flex justify-around items-center my-auto pb-1">
              {['김해', '창녕'].map((loc, idx) => {
                const locItem = getLocData(loc, tbmData?.locations || []);
                const pct = locItem.pct || 0;
                return (
                  <div key={loc} className="gauge-item flex flex-col items-center">
                    <div className="liq-gauge-wrap relative w-[86px] h-[86px] flex items-center justify-center">
                      <svg className="liq-progress-ring absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="liq-ring-bg" cx="50" cy="50" r="43" fill="none" stroke="#f2f4f6" strokeWidth="7" />
                        <circle className="liq-ring-fill transition-all duration-1000" cx="50" cy="50" r="43" fill="none" stroke="#3182f6" strokeWidth="7" strokeLinecap="round" strokeDasharray="270.17" strokeDashoffset={270.17 - (pct/100)*270.17} />
                      </svg>
                      <div className="liq-tank-circle absolute w-[68px] h-[68px] rounded-full overflow-hidden bg-white shadow-xs flex items-center justify-center">
                        <div className="liq-val-circle absolute z-10 font-bold text-sm text-[#191f28]">{pct}<span className="liq-pct text-xs">%</span></div>
                        <div className="liq-fill-circle absolute bottom-0 w-full transition-all duration-1000 overflow-hidden" style={{ height: `${pct}%` }}>
                          <div className="liq-solid-circle w-full h-full" style={{ background: '#3182f6', opacity: 0.15 }}></div>
                        </div>
                      </div>
                    </div>
                    <span className="gauge-label font-semibold text-xs text-[#4e5968] mt-2">{loc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Legal Status */}
        <div className="content-card kpi-dashboard-card bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-[360px] flex flex-col justify-between border border-slate-100 transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="pro-card-header -mx-6 -mt-6 p-4 px-6 bg-slate-50/70 rounded-t-3xl border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-sm shadow-md shadow-emerald-500/20">
                <i className="fa-solid fa-gavel"></i>
              </div>
              <h4 className="font-extrabold text-slate-800 m-0 text-[15px] tracking-tight">법정의무교육 현황</h4>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs">금년 기준</span>
          </div>

          <div className="home-card-content loaded flex flex-col flex-1 overflow-hidden pt-4" id="home-legal-content">
            <div className="kpi-mini-row grid grid-cols-4 gap-2 mb-3 shrink-0">
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">대상</span>
                <span className="value block text-xl font-extrabold text-[#191f28]">{legalData?.total?.target || 0}<small className="text-xs font-medium text-[#6b7684] ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">이수</span>
                <span className="value block text-xl font-extrabold text-[#3182f6]">{legalData?.total?.done || 0}<small className="text-xs font-medium text-[#3182f6] ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">미이수</span>
                <span className="value block text-xl font-extrabold text-[#f04452]">{legalData?.total?.undone || 0}<small className="text-xs font-medium text-[#f04452] ml-0.5">명</small></span>
              </div>
              <div className="kpi-mini-item text-center bg-[#f9fafb] rounded-2xl py-3">
                <span className="label block text-[11px] font-semibold text-[#8b95a1] mb-0.5">이수율</span>
                <span className="value block text-xl font-extrabold text-[#191f28]">{legalData?.total?.rate || 0}<small className="text-xs font-medium text-[#6b7684] ml-0.5">%</small></span>
              </div>
            </div>

            {/* Toss Minimal Person Icons */}
            <div className="flex items-center justify-center gap-1.5 py-2 my-1 shrink-0 bg-[#f9fafb] rounded-xl">
              {Array.from({ length: Math.min(legalData?.total?.done || 3, 10) }).map((_, i) => (
                <i key={`done-${i}`} className="fa-solid fa-user-check text-[#3182f6] text-xs"></i>
              ))}
              {Array.from({ length: Math.min(legalData?.total?.undone || 7, 10) }).map((_, i) => (
                <i key={`undone-${i}`} className="fa-solid fa-user-xmark text-[#f04452] text-xs"></i>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pt-1">
              {legalData?.officers?.map((officer: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 px-3 bg-[#f9fafb] rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white text-[#4e5968] rounded-md font-bold text-[10px] shadow-2xs">{officer.loc}</span>
                    <span className="font-bold text-[#191f28] text-[12px]">{officer.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${officer.isDanger ? 'text-[#f04452]' : 'text-[#ff9500]'} font-extrabold text-xs`}>{officer.dday}</span>
                    <span className={`text-[10px] ${officer.isDanger ? 'bg-[#feeef0] text-[#f04452]' : 'bg-[#fff8e6] text-[#ff9500]'} px-2 py-0.5 rounded-md font-bold`}>{officer.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Row 2: Info Grid - Toss Style */}
      <section className="home-grid-bottom mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* KOSHA News */}
        <div className="content-card list-card bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-[360px] flex flex-col justify-between border border-slate-100 transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="pro-card-header -mx-6 -mt-6 p-4 px-6 bg-slate-50/70 rounded-t-3xl border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center text-sm shadow-md shadow-rose-500/20">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h4 className="font-extrabold text-slate-800 m-0 text-[15px] tracking-tight">사고 속보</h4>
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
            }} className="cursor-pointer bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs">
              {isSirenLoading ? (
                <i className="fa-solid fa-spinner fa-spin text-white"></i>
              ) : (
                <i className="fa-solid fa-bell text-white text-xs"></i>
              )}
              {isSirenLoading ? ' 불러오는 중...' : ' 사이렌 알림'}
            </span>
          </div>
          <div className="scroll-list overflow-y-auto flex-1 divide-y divide-[#f2f4f6] pt-1">
            {newsData?.kosha?.map((item: any, i: number) => {
              const tagText = item.tag || '사망 1명';
              const locText = item.loc || '전국';

              return (
                <a key={i} href={item.link || '#'} onClick={(e) => { e.preventDefault(); openModal('사고 속보', item.text, item.link, item); }} className="flex justify-between items-center py-3 px-1 hover:bg-[#f9fafb] cursor-pointer transition group border-b border-[#f2f4f6] last:border-none">
                  <span className="font-semibold text-[#333d4b] text-[13px] truncate max-w-[80%] pr-2 group-hover:text-[#3182f6] transition-colors">
                    <span className="text-[#3182f6] font-extrabold mr-1.5">[{locText}]</span>
                    <span className="truncate">{item.text}</span>
                  </span>
                  <span className="text-[13px] font-extrabold text-[#e53e3e] shrink-0">{tagText}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Safety News */}
        <div className="content-card list-card bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-[360px] flex flex-col justify-between border border-slate-100 transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="pro-card-header -mx-6 -mt-6 p-4 px-6 bg-slate-50/70 rounded-t-3xl border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-sm shadow-md shadow-indigo-500/20">
                <i className="fa-solid fa-newspaper"></i>
              </div>
              <h4 className="font-extrabold text-slate-800 m-0 text-[15px] tracking-tight">최신 안전 뉴스</h4>
            </div>
          </div>
          <div className="scroll-list overflow-y-auto flex-1 divide-y divide-[#f2f4f6] pt-1">
            {newsData?.safety?.map((news: any, i: number) => (
              <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center py-3 px-1 hover:bg-[#f9fafb] cursor-pointer transition group">
                <span className="font-semibold text-[#333d4b] text-[13px] truncate max-w-[78%] group-hover:text-[#3182f6] transition-colors">{news.title}</span>
                <span className="text-[11px] font-medium text-[#8b95a1] shrink-0">{news.date}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Weather - Toss Style */}
        <div className="content-card weather-card bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-[360px] flex flex-col justify-between border border-slate-100 transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="pro-card-header -mx-6 -mt-6 p-4 px-6 bg-slate-50/70 rounded-t-3xl border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center text-sm shadow-md shadow-amber-500/20">
                <i className="fa-solid fa-cloud-sun"></i>
              </div>
              <h4 className="font-extrabold text-slate-800 m-0 text-[15px] tracking-tight">날씨 정보</h4>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              실시간
            </span>
          </div>
          <div className="weather-grid-detailed grid grid-cols-3 divide-x divide-[#f2f4f6] pt-2 flex-1">
            {weatherData?.map((weather: any) => (
              <div key={weather.loc} className="flex flex-col items-center justify-between text-center px-1 py-1 h-full">
                <a href={`https://search.naver.com/search.naver?query=${weather.loc}+날씨`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#191f28] hover:text-[#3182f6] transition">
                  {weather.loc}
                </a>
                
                <span className="text-[10px] text-[#3182f6] font-semibold bg-[#e8f3ff] px-2 py-0.5 rounded-full my-0.5">어제 {weather.diff}</span>
                
                <i className={`fa-solid ${weather.icon} ${weather.color} text-3xl my-1`}></i>
                
                <span className="text-2xl font-extrabold text-[#191f28] tracking-tight my-0.5">{weather.temp}°C</span>
                
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#6b7684] my-0.5">
                  <i className="fa-solid fa-droplet text-[#3182f6]"></i> {weather.hum}%
                </div>
                
                <span className="text-[11px] font-medium text-[#8b95a1] my-0.5">체감 {weather.feel}°C</span>
                
                <span className={`text-[10px] font-bold ${weather.alert === '기상특보 없음' ? 'text-[#00b493] bg-[#e6f7f4]' : 'text-[#f04452] bg-[#feeef0]'} px-2 py-0.5 rounded-full my-1`}>
                  {weather.alert}
                </span>
                
                <div className="flex items-center gap-1 text-[10px] font-medium text-[#8b95a1] mt-auto pt-2 border-t border-[#f2f4f6] w-full justify-center">
                  내일 <i className="fa-solid fa-cloud text-[#b0b8c1]"></i> {weather.tomorrow}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
