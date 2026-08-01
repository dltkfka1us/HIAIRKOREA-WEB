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
  { loc: "경북 구미시", fullLoc: "경북 구미시", type: "산업재해", timeInfo: "2026-07-28", casualty: "사망 1명", content: "칼라강판 덧씌우기 작업 중 밟고 있던 채광창이 파손되며 바닥으로 떨어져 사망함.", text: "칼라강판 덧씌우기 작업 중 밟고 있던 채광창이 파손되며 떨어짐", tag: "사망 1명", dateNum: 20260728, link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" },
  { loc: "경남 함양군", fullLoc: "경남 함양군", type: "산업재해", timeInfo: "2026-07-28", casualty: "사망 1명", content: "설비 내 슬러지 제거 작업 중 설비가 갑자기 가동되어 스크류에 끼임 사망함.", text: "설비 내 슬러지 제거 작업 중 설비가 갑자기 가동되어 스크류에 끼임", tag: "사망 1명", dateNum: 20260728, link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" },
  { loc: "경북 경주시", fullLoc: "경북 경주시", type: "산업재해", timeInfo: "2026-07-27", casualty: "사망 1명", content: "철골 위에서 철골 조립 작업 중 균형을 잃고 아래로 떨어짐.", text: "철골 위에서 철골 조립 작업 중 떨어짐", tag: "사망 1명", dateNum: 20260727, link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" },
  { loc: "경북 포항시", fullLoc: "경북 포항시", type: "산업재해", timeInfo: "2026-07-27", casualty: "사망 1명", content: "철거 공사현장에서 배관을 밟고 이동 중 미끄러져 바닥으로 떨어짐.", text: "철거 공사현장에서 철거 작업을 위해 배관을 밟고 이동 중 바닥으로 떨어짐", tag: "사망 1명", dateNum: 20260727, link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" },
  { loc: "전남 순천시", fullLoc: "전남 순천시", type: "산업재해", timeInfo: "2026-07-26", casualty: "사망 1명", content: "풍력발전기 기둥 용접을 위해 작업발판 위에서 작업 중 떨어짐.", text: "풍력발전기 기둥 용접을 위해 작업발판 위에서 작업 중 떨어짐", tag: "사망 1명", dateNum: 20260726, link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" },
  { loc: "경기 김포시", fullLoc: "경기 김포시", type: "산업재해", timeInfo: "2026-07-25", casualty: "사망 1명", content: "지붕 판넬 해체 작업 중 해체된 판넬을 잡으려다 고소작업대에서 떨어짐.", text: "지붕 판넬 해체 작업 중 해체된 판넬을 잡으려다 고소작업대에서 떨어짐", tag: "사망 1명", dateNum: 20260725, link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01" }
];

function parseTitleRegex(title: string) {
  let location = "전국";
  let dateStr = "";
  let month = 0;
  let day = 0;
  let cleanTitle = title;
  let casualty = "사망 1명"; // KOSHA 중대재해 속보 기본값

  // Extract Casualty if explicitly present (e.g. 사망 2명, 부상 1명)
  const casMatch = title.match(/(사망\s*\d+명|부상\s*\d+명)/);
  if (casMatch) {
    casualty = casMatch[1];
  }

  // Pattern: [7/28, 경북 구미시] or [7/26, 전남광주 순천시]
  const matchHeader = title.match(/^\[\s*(\d{1,2})\/(\d{1,2})\s*,\s*([^\]]+)\]/);
  if (matchHeader) {
    month = parseInt(matchHeader[1], 10);
    day = parseInt(matchHeader[2], 10);
    dateStr = `${month}/${day}`;
    location = matchHeader[3]
      .replace(/전남광주/, "전남")
      .replace(/전북전주/, "전북")
      .replace(/경북대구/, "경북")
      .replace(/경남부산/, "경남")
      .trim();
    cleanTitle = title.replace(matchHeader[0], '').trim();
  } else {
    const locMatch = title.match(/\[([^\]]+)\]/);
    if (locMatch) {
      location = locMatch[1].trim();
      cleanTitle = title.replace(locMatch[0], '').trim();
    }
  }

  // Full location formatted like "경북 구미시", "경남 함양군"
  let fullLoc = location;
  if (!fullLoc.includes('시') && !fullLoc.includes('군') && !fullLoc.includes('구')) {
    fullLoc = location;
  }

  // Calculate sort score (newer date first)
  const sortScore = (month * 100) + day;

  return { 
    loc: fullLoc, 
    fullLoc, 
    dateStr, 
    sortScore,
    cleanTitle: cleanTitle || title,
    tag: casualty 
  };
}

export async function getKoshaRealtimeNews() {
  try {
    const list = await fetchPostList();
    if (!list || list.length === 0) {
      console.warn("fetchPostList returned empty, using fallback");
      return FALLBACK_KOSHA_NEWS;
    }

    const results = list.map((post: any) => {
      const title = post.pstNm || '';
      const regDate = post.frstRegDt ? post.frstRegDt : '';
      const parsed = parseTitleRegex(title);

      return {
        loc: parsed.loc,
        fullLoc: parsed.fullLoc,
        type: "산업재해",
        timeInfo: parsed.dateStr ? `2026-${parsed.dateStr.replace('/', '-')}` : (regDate ? regDate.slice(0, 10) : "최신"),
        casualty: parsed.tag,
        content: title,
        text: parsed.cleanTitle,
        tag: parsed.tag, // '사망 1명'
        sortScore: parsed.sortScore || (regDate ? parseInt(regDate.slice(4, 8), 10) : 0),
        link: "https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01"
      };
    });

    // 최신순 정렬 (sortScore 내림차순)
    results.sort((a: any, b: any) => b.sortScore - a.sortScore);

    return results.slice(0, 10);
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
