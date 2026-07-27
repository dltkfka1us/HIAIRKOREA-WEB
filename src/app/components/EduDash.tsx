'use client';

import { useState, useEffect } from 'react';
import { getEduDashboardStats, getEduYearlyTrend } from '@/lib/actions/edu.actions';

export default function EduDash() {
  const [stats, setStats] = useState<any>(null);
  const [trend, setTrend] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllIncomplete, setShowAllIncomplete] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashStats, trendData] = await Promise.all([
          getEduDashboardStats('2026-07'),
          getEduYearlyTrend(2026)
        ]);
        setStats(dashStats);
        setTrend(trendData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-[#1e88e5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const rate = stats.totalTarget > 0 ? Math.round((stats.totalCompleted / stats.totalTarget) * 100) : 0;
  const uncompleted = stats.totalTarget - stats.totalCompleted;

  // Liquid Chart SVG wave
  const getWaveSvg = (color: string) => `data:image/svg+xml;utf8,<svg viewBox='0 0 10 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><path d='M5,0 C12,25 -2,75 5,100 L0,100 L0,0 Z' fill='${color}'/></svg>`;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 4 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Target */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="text-indigo-900/60 font-bold text-sm mb-2">총 교육 대상</div>
          <div className="flex items-baseline gap-1">
            <h1 className="text-4xl font-black text-indigo-900">{stats.totalTarget}</h1>
            <span className="text-indigo-900/60 font-bold">명</span>
          </div>
          <i className="fa-solid fa-users absolute bottom-[-10px] right-2 text-6xl text-indigo-200/50"></i>
        </div>
        {/* Completed */}
        <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="text-emerald-900/60 font-bold text-sm mb-2">이수 완료</div>
          <div className="flex items-baseline gap-1">
            <h1 className="text-4xl font-black text-emerald-600">{stats.totalCompleted}</h1>
            <span className="text-emerald-900/60 font-bold">명</span>
          </div>
          <i className="fa-solid fa-user-check absolute bottom-[-10px] right-2 text-6xl text-emerald-200/50"></i>
        </div>
        {/* Uncompleted (Clickable) */}
        <div 
          onClick={() => setShowAllIncomplete(true)}
          className="bg-gradient-to-br from-rose-50 to-white p-5 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-100 transition-all"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-rose-900/60 font-bold text-sm">미이수</div>
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 opacity-80">
              <i className="fa-solid fa-expand"></i> 명단확인
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <h1 className="text-4xl font-black text-rose-500">{uncompleted}</h1>
            <span className="text-rose-900/60 font-bold">명</span>
          </div>
          <i className="fa-solid fa-user-xmark absolute bottom-[-10px] right-2 text-6xl text-rose-200/50"></i>
        </div>
        {/* Rate */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="text-blue-900/60 font-bold text-sm mb-2">이수율</div>
          <div className="flex items-baseline gap-1">
            <h1 className="text-4xl font-black text-blue-500">{rate}</h1>
            <span className="text-blue-900/60 font-bold">%</span>
          </div>
          <i className="fa-solid fa-chart-pie absolute bottom-[-10px] right-2 text-6xl text-blue-200/50"></i>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 사업장별 이수율 (Liquid Chart) */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <i className="fa-solid fa-chart-column"></i>
            </div>
            <h3 className="font-extrabold text-[#1e293b]">사업장별 이수율</h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-around px-4">
            {[
              { loc: '김해', data: stats.locations['김해'], color1: '#4f46e5', color2: '#3730a3', bgUrl: getWaveSvg('%23818cf8'), fgUrl: getWaveSvg('%234f46e5') },
              { loc: '부산', data: stats.locations['부산'], color1: '#059669', color2: '#065f46', bgUrl: getWaveSvg('%2334d399'), fgUrl: getWaveSvg('%23059669') },
              { loc: '창녕', data: stats.locations['창녕'], color1: '#d97706', color2: '#92400e', bgUrl: getWaveSvg('%23fbbf24'), fgUrl: getWaveSvg('%23d97706') },
            ].map(item => {
              const itemRate = item.data?.target > 0 ? Math.round((item.data.completed / item.data.target) * 100) : 0;
              return (
                <div key={item.loc} className="flex items-center gap-4">
                  <span className="font-bold text-sm w-10 text-gray-700">{item.loc}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-r-full overflow-hidden relative">
                    <div 
                      className="absolute left-0 top-0 bottom-0 transition-all duration-1000 ease-out flex items-center"
                      style={{ 
                        width: `${itemRate}%`, 
                        background: `linear-gradient(90deg, ${item.color2}, ${item.color1})`,
                        borderTopRightRadius: '999px',
                        borderBottomRightRadius: '999px'
                      }}
                    >
                      {/* Simple CSS Wave representation */}
                      <div className="absolute right-[-10px] w-5 h-full opacity-50" style={{ backgroundImage: `url("${item.bgUrl}")`, backgroundSize: '100% 100%' }}></div>
                      <div className="absolute right-[-5px] w-5 h-full" style={{ backgroundImage: `url("${item.fgUrl}")`, backgroundSize: '100% 100%' }}></div>
                    </div>
                  </div>
                  <span className="font-black text-lg w-12 text-right" style={{ color: item.color1 }}>{itemRate}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 전사 이수율 추이 (Trend Chart) */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <h3 className="font-extrabold text-[#1e293b]">전사 이수율 추이</h3>
          </div>

          <div className="flex-1 flex items-end justify-between gap-1 mt-2">
            {trend.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center w-full group">
                <span className="text-[10px] font-bold text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition">{val}%</span>
                <div className="w-full relative bg-gray-100 rounded-t-md overflow-hidden flex items-end h-[160px]">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 transition-all duration-1000"
                    style={{ height: `${val}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-semibold text-gray-500 mt-2">{idx + 1}월</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion Lists (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {['김해', '부산', '창녕'].map(loc => {
          const locData = stats.locations[loc];
          const uncompCount = locData ? locData.target - locData.completed : 0;
          return (
            <div key={loc} className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                    <i className={loc === '부산' ? 'fa-solid fa-building' : 'fa-solid fa-industry'}></i>
                  </div>
                  <h3 className="font-extrabold text-[#1e293b]">{loc}</h3>
                </div>
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md">미이수 {uncompCount}명</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                {locData?.people?.map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                        {p.status === 'complete' 
                          ? <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>
                          : <i className="fa-solid fa-xmark text-rose-500 text-[10px]"></i>
                        }
                      </div>
                      <span className="text-xs font-bold text-gray-700">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400">{p.dept}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* All Incomplete Modal */}
      {showAllIncomplete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 h-[80vh]">
            <div className="bg-gradient-to-r from-rose-600 to-rose-500 p-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
                  <i className="fa-solid fa-user-xmark"></i>
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">전체 미이수자 명단</h2>
                  <p className="text-rose-100 text-xs font-medium mt-0.5">당월 교육 대상자 중 미이수 현황</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full">총 {uncompleted}명</span>
                <button 
                  onClick={() => setShowAllIncomplete(false)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition border border-white/20"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['김해', '부산', '창녕'].map(loc => {
                  const locData = stats.locations[loc];
                  const uncomps = locData?.people?.filter((p: any) => p.status === 'incomplete') || [];
                  return (
                    <div key={loc} className="space-y-3">
                      <div className="flex items-center gap-2 border-b-2 border-rose-100 pb-2">
                        <h3 className="font-extrabold text-slate-700">{loc}</h3>
                        <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">{uncomps.length}명</span>
                      </div>
                      <div className="space-y-2">
                        {uncomps.map((p: any, i: number) => (
                          <div key={i} className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex justify-between items-center">
                            <span className="font-bold text-sm text-slate-700">{p.name}</span>
                            <span className="text-xs text-slate-500 font-medium">{p.dept}</span>
                          </div>
                        ))}
                        {uncomps.length === 0 && (
                          <div className="text-center py-4 text-xs font-bold text-emerald-500 bg-emerald-50 rounded-xl">
                            미이수자가 없습니다! 🎉
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
