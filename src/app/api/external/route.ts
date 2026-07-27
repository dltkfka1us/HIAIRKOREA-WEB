import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'weather') {
    // 실제 날씨 API 연동 시 이 부분을 기상청 API Fetch 로직으로 교체합니다.
    // 서버에서 외부 API를 호출하므로 CORS 문제가 발생하지 않으며 API Key가 노출되지 않습니다.
    
    // Fallback Mock Data
    const weatherData = [
      { loc: '김해', diff: '▼ 1.5°', temp: '28.9', hum: '73', feel: '30.4', alert: '기상특보 없음', tomorrow: '25° / 33°', icon: 'fa-sun', color: 'text-amber-500' },
      { loc: '부산', diff: '▼ 0.6°', temp: '30.8', hum: '72', feel: '32.3', alert: '기상특보 없음', tomorrow: '26° / 33°', icon: 'fa-cloud', color: 'text-slate-400' },
      { loc: '창녕', diff: '▼ 1.5°', temp: '30.2', hum: '73', feel: '31.8', alert: '기상특보 없음', tomorrow: '25° / 35°', icon: 'fa-sun', color: 'text-amber-500' }
    ];

    return NextResponse.json(weatherData, {
      headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' } // 1시간 캐싱
    });
  }

  if (type === 'news') {
    // 실제 운영 시 구글 시트에서 가져오던 로직을 Supabase 'news' 테이블로 옮기거나
    // 크론(Cron) 잡을 통해 수집한 데이터를 반환합니다.
    
    // Fallback Mock Data
    const newsData = {
      kosha: [
        { loc: '[대구 수성구]', text: '창호를 해체작업 중 단부로 떨어짐', tag: '사망 1명' },
        { loc: '[경기 평택시]', text: '가공설비 정비 작업 중 끼임', tag: '사망 1명' },
        { loc: '[충남 보령시]', text: '사다리에 올라가 전국기 설치 준비 작업 중 떨어짐', tag: '사망 1명' },
        { loc: '[충남 서산시]', text: '태양광 설비 전선 교체작업 중 감전', tag: '사망 1명' },
        { loc: '[경남 사천시]', text: '제어판넬 내 전선 연결작업 중 감전', tag: '사망 1명' },
        { loc: '[충남 당진시]', text: '적재기 조정 작업 중 끼임', tag: '사망 1명' },
      ],
      safety: [
        { title: '철강 3사, 지난해 모두 사망사고...안전지표 개선도 \'숙제\'', date: '07-27' },
        { title: '권은비, 필라테스 추락 사고 당했다..."구멍으로 빠져" [스타이슈]', date: '07-27' },
        { title: '경산시, 재해 매뉴얼 개정...예방부터 사고 수습까지 정비', date: '07-27' },
        { title: '동래구, 안전 실천 결의대회 개최..."중대재해 없는 안전한 일터 ...', date: '07-27' },
        { title: 'HD현대중공업 군산조선소 끼임 사고로 사망자 1명 발생', date: '07-27' },
        { title: '서울시설공단, 산업재해 예방 유공 고용노동부 장관표창 수상', date: '07-27' },
      ]
    };

    return NextResponse.json(newsData, {
      headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' }
    });
  }

  return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
}
