// 당선인 정보 (WinnerInfoInqireService2)
// 데이터셋 15000864 — https://www.data.go.kr/data/15000864/openapi.do
// 용도: 역대 당선자 정보 — 직전 당선자 ↔ 현재 후보 매핑

import { getKey, necFetch } from "./client";

interface WinnerRaw {
  num?: string;
  sgId?: string;
  sgTypecode?: string;
  sgName?: string;
  sggCityName?: string;
  sggName?: string;
  sdName?: string;
  wiwName?: string;
  name?: string;
  jdName?: string;
  age?: string;
  sex?: string;
  gender?: string;
  edu?: string;
  career1?: string;
  career2?: string;
  vote?: string;
  voteRate?: string;
  dugsu?: string; // 득수 (실제 NEC 필드명)
  dugyul?: string; // 득률 (실제 NEC 필드명)
}

export interface NECWinner {
  num: number;
  sgId: string;
  sgTypecode: string;
  sgName?: string;
  regionName?: string;
  sdName?: string;
  sggName?: string;
  wiwName?: string;
  name: string;
  party?: string;
  age?: number;
  gender?: "M" | "F";
  education?: string;
  careers: string[];
  voteCount?: number;
  voteShare?: number; // 0-1
}

function normalize(r: WinnerRaw): NECWinner {
  const g = r.gender ?? r.sex;
  const voteCount = r.dugsu ?? r.vote;
  const voteRate = r.dugyul ?? r.voteRate;
  return {
    num: Number(r.num ?? 0),
    sgId: r.sgId ?? "",
    sgTypecode: r.sgTypecode ?? "",
    sgName: r.sgName,
    regionName: r.sggCityName ?? r.sggName ?? r.sdName,
    sdName: r.sdName,
    sggName: r.sggName,
    wiwName: r.wiwName,
    name: r.name ?? "",
    party: r.jdName,
    age: r.age ? Number(r.age) : undefined,
    gender: g === "남" ? "M" : g === "여" ? "F" : undefined,
    education: r.edu,
    careers: [r.career1, r.career2].filter(Boolean) as string[],
    voteCount: voteCount ? Number(String(voteCount).replace(/,/g, "")) : undefined,
    voteShare: voteRate ? Number(voteRate) / 100 : undefined,
  };
}

export interface FetchWinnerOpts {
  sgId: string;
  sgTypecode: string;
  sdName?: string;
  pageNo?: number;
  numOfRows?: number;
}

export async function fetchWinners(
  opts: FetchWinnerOpts,
): Promise<NECWinner[]> {
  const key = getKey("VITE_NEC_WINNER_KEY");
  if (!key) return [];
  const res = await necFetch<WinnerRaw>({
    service: "WinnerInfoInqireService2",
    method: "getWinnerInfoInqire",
    serviceKey: key,
    params: {
      sgId: opts.sgId,
      sgTypecode: opts.sgTypecode,
      sdName: opts.sdName,
      pageNo: opts.pageNo ?? 1,
      numOfRows: opts.numOfRows ?? 200,
    },
  });
  return res.items.map(normalize);
}
