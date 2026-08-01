import { getEduStats, getTbmStats, getLegalStats, getNotices } from '@/lib/actions/home.actions';
import DashboardClient from './components/DashboardClient';
import { getKoshaRealtimeNews, getKoshaAlertPosters } from '@/lib/services/kosha.service';

export const dynamic = 'force-dynamic';


async function getWeatherData() {
  const cities = [
    { loc: '김해', query: '김해시 진례면 날씨' },
    { loc: '부산', query: '부산시 사상구 날씨' },
    { loc: '창녕', query: '창녕군 도천면 날씨' }
  ];

  const results = await Promise.all(cities.map(async ({ loc, query }) => {
    try {
      const url = `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
      const res = await fetch(url, { next: { revalidate: 600 } }); // 10분 캐싱
      const html = await res.text();

      const tempMatch = html.match(/class="temperature_text"[^>]*>\s*<strong><span class="blind">현재 온도<\/span>\s*([-0-9.]+)/);
      const currTemp = tempMatch ? tempMatch[1] : '-';

      const humMatch = html.match(/습도<\/dt>\s*<dd class="desc">([0-9.]+)%/);
      const currHum = humMatch ? humMatch[1] : '-';

      const diffMatch = html.match(/어제보다\s*<span[^>]*>\s*([0-9.]+)°\s*<span[^>]*>(높아요|낮아요|같아요)/);
      let diffStr = '- 0.0°';
      if (diffMatch) {
        const val = diffMatch[1];
        const type = diffMatch[2];
        if (type === '높아요') diffStr = `▲ ${val}°`;
        else if (type === '낮아요') diffStr = `▼ ${val}°`;
      }

      const summaryMatch = html.match(/class="weather before_slash">([^<]+)</);
      const currCondition = summaryMatch ? summaryMatch[1] : '맑음';

      // 내일 기온 파싱
      const weekItems = [...html.matchAll(/<li class="week_item.*?<\/li>/gs)];
      let tomorrow = '- / -';
      if (weekItems.length > 1) {
        const tmrwHtml = weekItems[1][0];
        const minM = tmrwHtml.match(/lowest.*?([-0-9]+)°/);
        const maxM = tmrwHtml.match(/highest.*?([-0-9]+)°/);
        if (minM && maxM) tomorrow = `${minM[1]}° / ${maxM[1]}°`;
      }

      // 상태별 아이콘 및 색상
      let icon = 'fa-sun';
      let color = 'text-amber-500';
      if (currCondition.includes('구름') || currCondition.includes('흐림')) { icon = 'fa-cloud'; color = 'text-slate-400'; }
      if (currCondition.includes('비')) { icon = 'fa-cloud-rain'; color = 'text-blue-500'; }
      if (currCondition.includes('눈')) { icon = 'fa-snowflake'; color = 'text-sky-300'; }

      return {
        loc,
        diff: diffStr,
        temp: currTemp,
        hum: currHum,
        feel: currTemp, // 생략
        alert: Number(currTemp) >= 33 ? '폭염특보' : '기상특보 없음',
        tomorrow,
        icon,
        color
      };
    } catch(e) {
      return { loc, diff: '-', temp: '-', hum: '-', feel: '-', alert: '연결오류', tomorrow: '- / -', icon: 'fa-cloud', color: 'text-slate-300' };
    }
  }));

  return results;
}

async function getNewsData() {
  let safetyNews: any[] = [];
  try {
    const query = '(중대재해 OR 산업재해 OR 산업안전보건 OR "끼임 사고" OR "추락 사고" OR "화재 폭발") -교통 -주식 -부동산 -연예 -스포츠';
    const RSS_URL = "https://news.google.com/rss/search?q=" + encodeURIComponent(query) + "&hl=ko&gl=KR&ceid=KR:ko";
    
    const rssRes = await fetch(RSS_URL, { cache: 'no-store' });
    const xmlData = await rssRes.text();
    
    const itemsRaw = xmlData.split('<item>').slice(1);
    safetyNews = itemsRaw.slice(0, 10).map(item => {
      const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

      let title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '제목 없음';
      let link = linkMatch ? linkMatch[1].trim() : '#';
      let pubDateStr = pubDateMatch ? pubDateMatch[1] : '';
      
      let dateFormatted = '';
      if (pubDateStr) {
        const d = new Date(pubDateStr);
        dateFormatted = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }
      return { title, link, date: dateFormatted };
    });
  } catch (e) { console.error('RSS Fetch error:', e); }

  let koshaNews: any[] = [];
  try {
    koshaNews = await getKoshaRealtimeNews();
  } catch (e) { console.error('KOSHA Realtime Fetch error:', e); }

  return {
    kosha: koshaNews.length > 0 ? koshaNews : [
      { loc: '[데이터 없음]', text: '통신 오류 또는 데이터가 없습니다.', tag: '-' }
    ],
    safety: safetyNews
  };
}

export default async function HomePage() {
  // Server-side Data Fetching in parallel for maximum speed
  const [eduData, tbmData, legalData, notices, weatherData, newsData] = await Promise.all([
    getEduStats('2026-07'),
    getTbmStats('2026-07-27'),
    getLegalStats(2026),
    getNotices(),
    getWeatherData(),
    getNewsData()
  ]);

  return (
    <DashboardClient 
      initialData={{
        eduData,
        tbmData,
        legalData,
        notices,
        weatherData,
        newsData
      }}
    />
  );
}
