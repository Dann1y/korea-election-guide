// 후보자 통합검색 (CnddtMergedSrch)
// 데이터셋 15140045 — https://www.data.go.kr/data/15140045/openapi.do
//
// 주의: 정확한 service/method 경로는 활용가이드 다운로드 후 확정 필요.
// 현재 추정 경로로 두고, 첫 호출에서 에러 시 보정.

import { getKey, necFetch } from "./client";

interface SearchRaw {
  num?: string;
  name?: string;
  jdName?: string;
  giho?: string;
  job?: string;
  edu?: string;
  career1?: string;
  career2?: string;
  sgName?: string;
  isWinner?: string;
}

export interface NECSearchResult {
  num: number;
  name: string;
  party?: string;
  giho?: string;
  job?: string;
  education?: string;
  careers: string[];
  electionName?: string;
  isWinner?: boolean;
}

function normalize(r: SearchRaw): NECSearchResult {
  return {
    num: Number(r.num ?? 0),
    name: r.name ?? "",
    party: r.jdName,
    giho: r.giho,
    job: r.job,
    education: r.edu,
    careers: [r.career1, r.career2].filter(Boolean) as string[],
    electionName: r.sgName,
    isWinner: r.isWinner === "Y" || r.isWinner === "1",
  };
}

export interface SearchOpts {
  name: string;
  pageNo?: number;
  numOfRows?: number;
}

// TODO: 정확한 service/method 경로는 활용가이드 (OpenAPI활용가이드(후보자통합검색)_v1.0.zip) 확인 후 보정.
const SERVICE_GUESS = "CnddtSrchService";
const METHOD_GUESS = "getCnddtSrch";

export async function searchCandidates(
  opts: SearchOpts,
): Promise<NECSearchResult[]> {
  const key = getKey("VITE_NEC_SEARCH_KEY");
  if (!key) return [];
  try {
    const res = await necFetch<SearchRaw>({
      service: SERVICE_GUESS,
      method: METHOD_GUESS,
      serviceKey: key,
      params: {
        name: opts.name,
        pageNo: opts.pageNo ?? 1,
        numOfRows: opts.numOfRows ?? 50,
      },
    });
    return res.items.map(normalize);
  } catch (e) {
    // endpoint 추정이 틀린 경우 명시적 안내
    console.warn(
      "후보자 통합검색 API endpoint 추정 실패. 활용가이드 확인 필요:",
      e,
    );
    return [];
  }
}
