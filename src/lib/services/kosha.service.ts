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

export const getKoshaRealtimeNews = unstable_cache(async () => {
  const list = await fetchPostList();
  
  // 10개 실시간 파싱
  const topList = list.slice(0, 10); 

  // 병렬 처리로 속도 대폭 향상
  const results = await Promise.all(
    topList.map(async (post: any) => {
      const detail = await fetchPostDetail(post.bbsId, post.pstNo);
      if (!detail) return null;

      const plain = detail.pstCn.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      const analysis = await parseWithGemini(plain, detail.pstNm);

      return {
        loc: shortenLoc(analysis.location || ''),
        fullLoc: analysis.location,
        type: analysis.accidentType,
        timeInfo: analysis.timeInfo,
        casualty: analysis.casualty,
        content: analysis.correctedContent,
        text: analysis.cleanTitle || detail.pstNm,
        tag: analysis.casualty || '확인중',
        link: `https://portal.kosha.or.kr/archive/imprtnDsstrAlrame/CSADV50000/CSADV50000M01`
      };
    })
  );

  return results.filter(Boolean);
}, ['kosha-realtime-v2'], { revalidate: 3600 });

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
