async function testKoshaTitles() {
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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "accept": "application/json, text/plain, */*",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "chnlid": "portal24"
      },
      body: "_JSON=" + encodeURIComponent(JSON.stringify(jsonBody))
    });
    const data = await res.json();
    const list = data?.response?.bbsPstGrid || [];
    console.log("Found items:", list.length);
    list.slice(0, 10).forEach((item, idx) => {
      console.log(`[${idx+1}] Title:`, item.pstNm);
      console.log(`     RegDate:`, item.frstRegDt);
    });
  } catch (e) {
    console.error("Error:", e);
  }
}

testKoshaTitles();
