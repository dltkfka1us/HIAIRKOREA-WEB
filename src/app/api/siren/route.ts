import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  const apiUrl = "https://portal.kosha.or.kr/api/portal24/bizC/p/CSADV50000/selectImprtnDsstrSirnList";
  const payload = { page: 1, resultPageTotalCnt: 0, rowsPerPage: 10, crtrDate: "", pstSeCd: "" };

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        "Referer": "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01",
        "Origin": "https://portal.kosha.or.kr"
      },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });
    
    if (res.ok) {
      const data = await res.json();
      const list = data?.payload?.imprtnDsstrSirnList;
      if (list && list.length > 0) {
        const mapped = list.map((item: any) => ({
          title: item.imprtnDsstrSirnNm,
          date: item.frstRegDt,
          imgSrc: item.imgSrc
        })).filter((item: any) => item.imgSrc); // imgSrc 있는 것만 반환
        return NextResponse.json({ success: true, data: mapped });
      }
    }
  } catch(e) {
    console.error("fetchSiren API err", e);
  }
  
  return NextResponse.json({ success: false, data: [] });
}
