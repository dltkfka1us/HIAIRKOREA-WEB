import { unstable_cache } from 'next/cache';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function fetchPostList() {
  const url = "https://portal.kosha.or.kr/api/compn24/auth/stdtboard/process.do";
  const jsonBody = {
    "common": {
      "frontInfo": { "viewId": "", "menuId": "", "siteId": "" }, "frontAuthKey": "", "auth": {}, "securityInfo": {},
      "data": {
        "pagingInfo": null, "whereId": null, "tboard": { "systemCd": "20", "channel": "web", "bbsId": "B2025021314108", "bbsGrpId": "", "serviceId": "basicAccess" }
      }
    },
    "service": {
      "info": { "id": "", "type": "" },
      "data": {
        "searchDefaultCndGrid": [{
          "orPstNm": "", "orPstCn": "", "curPageCo": 1, "recodePageCo": 10, "rowsPerPage": 10, "pstSeCd": "1200001",
          "atcflCntSrchYn": "Y", "artclNoList": [], "pstNoOrder": "Y", "isDesc": "Y", "sortType": "01", "sortOrder": "1",
          "isAddPstCn": "N"
        }], "searchArtclCndGrid": []
      }
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "chnlid": "portal24",
      },
      body: "_JSON=" + encodeURIComponent(JSON.stringify(jsonBody)),
      next: { revalidate: 3600 } // 캐싱 1시간
    });
    const data = await res.json();
    return data?.response?.bbsPstGrid || [];
  } catch (e) {
    console.error("fetchPostList err", e);
    return [];
  }
}

async function fetchPostDetail(bbsId: string, pstNo: string) {
  const url = "https://portal.kosha.or.kr/api/compn24/auth/stdtboard/process.do";
  const jsonBody = {
    "common": {
      "frontInfo": { "viewId": "", "menuId": "", "siteId": "" }, "frontAuthKey": "", "auth": {}, "securityInfo": {},
      "data": { "pagingInfo": null, "whereId": null, "tboard": { "systemCd": "20", "channel": "web", "bbsId": bbsId, "bbsGrpId": "", "serviceId": "basicRead" } }
    },
    "service": {
      "info": { "id": "", "type": "" }, "data": { "pstDefaultGrid": [{ "bbsId": bbsId, "pstNo": pstNo }] }
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "chnlid": "portal24",
      },
      body: "_JSON=" + encodeURIComponent(JSON.stringify(jsonBody)),
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    return data?.response?.bbsDetailInfo?.[0] || null;
  } catch (e) {
    return null;
  }
}

async function parseWithGemini(content: string, title: string) {
  if (!GEMINI_API_KEY) {
    return { timeInfo: "", location: "", accidentType: "", correctedContent: content, casualty: "", cleanTitle: title };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `
  다음은 안전보건공단의 중대재해 사고속보 텍스트입니다.
  불필요한 안내문구를 제외하고, 핵심 사고 개요만 3~4줄로 요약해주세요.
  
  또한 JSON 형식으로 다음 정보를 추출해주세요:
  {
    "location": "사고 발생 지역 (예: 경남 창원시, 없으면 '확인중')",
    "accidentType": "사고 유형 (예: 끼임, 추락, 화재, 확인중)",
    "timeInfo": "발생 일시 (예: 2024년 5월 10일 14:30경, 없으면 '확인중')",
    "casualty": "피해 규모 (예: 사망 1명, 부상 2명, 없으면 '확인중')",
    "correctedContent": "사고 핵심 요약 (3~4줄 내외)",
    "cleanTitle": "원본 제목에서 날짜나 괄호를 제거하고 '[지역] 사고내용' 형태로 정제 (예: [충남 당진시] 적재기 조정 작업 중 끼임)"
  }

  원본 제목: ${title}
  원본 텍스트:
  ${content}
  `;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
      }),
      // 중요: LLM 호출 결과도 24시간 캐싱 (게시물이 안 바뀌면 요약도 안 바뀜)
      next: { revalidate: 86400 } 
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (text) {
      return JSON.parse(text);
    }
  } catch (e) {
    console.error("Gemini err", e);
  }
  return { timeInfo: "", location: "", accidentType: "", correctedContent: content, casualty: "" };
}

function shortenLoc(fullLoc: string) {
  if (!fullLoc) return "";
  let loc = fullLoc.trim();
  loc = loc.replace(/광역시|특별시|특별자치시|특별자치도/, "");
  loc = loc.replace(/^경상북도/, "경북").replace(/^경상남도/, "경남");
  loc = loc.replace(/^충청북도/, "충북").replace(/^충청남도/, "충남");
  loc = loc.replace(/^전라북도/, "전북").replace(/^전라남도/, "전남");
  return loc;
}

const FALLBACK_KOSHA_NEWS = [
  { loc: "경북 구미", fullLoc: "경북 구미시", type: "추락 사고", timeInfo: "2026-07-28", casualty: "추락 사고", content: "칼라강판 덧씌우기 작업 중 밟고 있던 채광창이 파손되며 바닥으로 떨어져 사망함.", text: "칼라강판 덧씌우기 작업 중 채광창 파손으로 떨어짐", tag: "추락 사고", link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" },
  { loc: "경남 함양", fullLoc: "경남 함양군", type: "끼임 사고", timeInfo: "2026-07-28", casualty: "끼임 사고", content: "설비 내 슬러지 제거 작업 중 설비가 갑자기 가동되어 스크류에 끼임 사망함.", text: "설비 내 슬러지 제거 작업 중 스크류 끼임 사고", tag: "끼임 사고", link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" },
  { loc: "경북 경주", fullLoc: "경북 경주시", type: "추락 사고", timeInfo: "2026-07-27", casualty: "추락 사고", content: "철골 위에서 철골 조립 작업 중 균형을 잃고 아래로 떨어짐.", text: "철골 조립 작업 중 바닥으로 떨어짐", tag: "추락 사고", link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" },
  { loc: "경북 포항", fullLoc: "경북 포항시", type: "추락 사고", timeInfo: "2026-07-27", casualty: "추락 사고", content: "철거 공사현장에서 배관을 밟고 이동 중 미끄러져 바닥으로 떨어짐.", text: "배관 이동 중 미끄러져 바닥으로 떨어짐", tag: "추락 사고", link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" },
  { loc: "전남 순천", fullLoc: "전남 순천시", type: "추락 사고", timeInfo: "2026-07-26", casualty: "추락 사고", content: "풍력발전기 기둥 용접을 위해 작업발판 위에서 작업 중 떨어짐.", text: "풍력발전기 용접 작업발판 위에서 떨어짐", tag: "추락 사고", link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" }
];

function parseTitleRegex(title: string) {
  let location = "전국";
  let dateStr = "";
  let accidentType = "속보";
  let cleanTitle = title;

  // Pattern: [7/28, 경북 구미시] or [7/26, 전남광주 순천시]
  const matchHeader = title.match(/^\[\s*(\d{1,2}\/\d{1,2})\s*,\s*([^\]]+)\]/);
  if (matchHeader) {
    dateStr = matchHeader[1];
    location = matchHeader[2].trim();
    cleanTitle = title.replace(matchHeader[0], '').trim();
  } else {
    const locMatch = title.match(/\[([^\]]+)\]/);
    if (locMatch) {
      location = locMatch[1].trim();
      cleanTitle = title.replace(locMatch[0], '').trim();
    }
  }

  // Shorten location
  let shortLoc = location
    .replace(/전남광주/, "전남 순천")
    .replace(/전북전주/, "전북 전주")
    .replace(/경북대구/, "경북")
    .replace(/경남부산/, "경남")
    .replace(/시$|군$|구$/g, '')
    .trim();

  if (!shortLoc) shortLoc = "전국";

  // Determine accident type & tag
  if (cleanTitle.includes('끼임')) accidentType = '끼임 사고';
  else if (cleanTitle.includes('떨어짐') || cleanTitle.includes('추락')) accidentType = '추락 사고';
  else if (cleanTitle.includes('쓰러짐') || cleanTitle.includes('질식')) accidentType = '질식/쓰러짐';
  else if (cleanTitle.includes('맞음') || cleanTitle.includes('낙하')) accidentType = '낙하/맞음';
  else if (cleanTitle.includes('부딪힘') || cleanTitle.includes('충돌')) accidentType = '충돌/부딪힘';
  else if (cleanTitle.includes('화재') || cleanTitle.includes('폭발')) accidentType = '화재/폭발';
  else if (cleanTitle.includes('깔림') || cleanTitle.includes('무너짐')) accidentType = '붕괴/깔림';
  else accidentType = dateStr ? `${dateStr} 발생` : '속보';

  return { 
    shortLoc, 
    fullLoc: location, 
    dateStr, 
    accidentType, 
    cleanTitle: cleanTitle || title,
    tag: accidentType 
  };
}

export async function getKoshaRealtimeNews() {
  try {
    const list = await fetchPostList();
    if (!list || list.length === 0) {
      console.warn("fetchPostList returned empty, using fallback");
      return FALLBACK_KOSHA_NEWS;
    }

    const topList = list.slice(0, 10);
    const results = topList.map((post: any) => {
      const title = post.pstNm || '';
      const regDate = post.frstRegDt ? `${post.frstRegDt.slice(4,6)}-${post.frstRegDt.slice(6,8)}` : '';
      const parsed = parseTitleRegex(title);

      return {
        loc: parsed.shortLoc,
        fullLoc: parsed.fullLoc,
        type: parsed.accidentType,
        timeInfo: parsed.dateStr ? `2026-${parsed.dateStr.replace('/', '-')}` : (regDate ? `2026-${regDate}` : "최신"),
        casualty: parsed.accidentType,
        content: title,
        text: parsed.cleanTitle,
        tag: parsed.tag,
        link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01"
      };
    });

    return results.length > 0 ? results : FALLBACK_KOSHA_NEWS;
  } catch (e) {
    console.error("getKoshaRealtimeNews err:", e);
    return FALLBACK_KOSHA_NEWS;
  }
}




export const getKoshaAlertPosters = unstable_cache(async () => {
  const apiUrl = "https://portal.kosha.or.kr/api/portal24/bizC/p/CSADV50000/selectImprtnDsstrSirnList";
  // 10개 포스터 가져오기
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
      next: { revalidate: 3600 }
    });
    
    if (res.ok) {
      const data = await res.json();
      const list = data?.payload?.imprtnDsstrSirnList;
      if (list && list.length > 0) {
        return list.map((item: any) => ({
          title: item.imprtnDsstrSirnNm,
          date: item.frstRegDt,
          imgSrc: item.imgSrc
        })).filter((item: any) => item.imgSrc); // imgSrc 있는 것만
      }
    }
  } catch(e) {
    console.error("fetchSiren err", e);
  }
  return [];
}, ['kosha-siren-v2'], { revalidate: 3600 });
