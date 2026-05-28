// 역대 지방선거 실시상황 (ScgnLocElctExctSttnService)
// 데이터셋 15125467 — https://www.data.go.kr/data/15125467/openapi.do
// 용도: 1995~2022 회차별 메타데이터 (선거명, 일자, 정수, 투표율)

import { getKey, necFetch } from "./client";

interface StatusRaw {
  num?: string;
  elctNm?: string;
  elctNotmNm?: string;
  elctYmd?: string; // YYYYMMDD
  elctDywk?: string;
  fdno?: string;
  voteRt?: string;
  rmrk?: string;
}

export interface ElectionStatus {
  num: number;
  name: string;
  round?: string;
  date: string; // yyyy-mm-dd
  year: number;
  weekday?: string;
  totalSeats?: number;
  turnout?: number; // 0-1
  remark?: string;
}

function normalize(r: StatusRaw): ElectionStatus {
  const y = r.elctYmd ? Number(r.elctYmd.slice(0, 4)) : 0;
  const m = r.elctYmd ? r.elctYmd.slice(4, 6) : "01";
  const d = r.elctYmd ? r.elctYmd.slice(6, 8) : "01";
  return {
    num: Number(r.num ?? 0),
    name: r.elctNm ?? "",
    round: r.elctNotmNm,
    date: `${y}-${m}-${d}`,
    year: y,
    weekday: r.elctDywk,
    totalSeats: r.fdno ? Number(r.fdno) : undefined,
    turnout: r.voteRt ? Number(r.voteRt) / 100 : undefined,
    remark: r.rmrk,
  };
}

export interface FetchResponse {
  items: ElectionStatus[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}

export function hasNECKey(): boolean {
  return !!getKey("VITE_NEC_API_KEY");
}

export async function fetchElectionStatuses(opts?: {
  pageNo?: number;
  numOfRows?: number;
}): Promise<FetchResponse> {
  const key = getKey("VITE_NEC_API_KEY");
  if (!key) return { items: [], totalCount: 0, pageNo: 1, numOfRows: 0 };

  const res = await necFetch<StatusRaw>({
    service: "ScgnLocElctExctSttnService",
    method: "getScgnLocElctExctSttnInqire",
    serviceKey: key,
    params: {
      pageNo: opts?.pageNo ?? 1,
      numOfRows: opts?.numOfRows ?? 100,
    },
  });

  return {
    items: res.items.map(normalize).sort((a, b) => a.date.localeCompare(b.date)),
    totalCount: res.totalCount,
    pageNo: res.pageNo,
    numOfRows: res.numOfRows,
  };
}
