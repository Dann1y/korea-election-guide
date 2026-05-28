// 투·개표 정보 (VoteXmntckInfoInqireService2)
// 데이터셋 15000900 — https://www.data.go.kr/data/15000900/openapi.do
// 용도: 2022(8회) 선거구별 투·개표 결과 — 직전 임기 결과 표시

import { getKey, necFetch } from "./client";

interface VoteRaw {
  num?: string;
  sdName?: string;
  wiwName?: string;
  totSunsu?: string; // 총선거인수
  totTusu?: string; // 총투표자수
  Turnout?: string;
  turnout?: string;
}

export interface NECVoteStatus {
  num: number;
  sdName?: string;
  wiwName?: string;
  totalElectors?: number;
  totalVoters?: number;
  turnout?: number; // 0-1
}

function normalize(r: VoteRaw): NECVoteStatus {
  const t = r.Turnout ?? r.turnout;
  return {
    num: Number(r.num ?? 0),
    sdName: r.sdName,
    wiwName: r.wiwName,
    totalElectors: r.totSunsu ? Number(r.totSunsu) : undefined,
    totalVoters: r.totTusu ? Number(r.totTusu) : undefined,
    turnout: t ? Number(t) / 100 : undefined,
  };
}

export interface FetchVoteOpts {
  sgId: string;
  sgTypecode: string;
  sdName?: string;
  wiwName?: string;
  pageNo?: number;
  numOfRows?: number;
}

export async function fetchVoteStatus(
  opts: FetchVoteOpts,
): Promise<NECVoteStatus[]> {
  const key = getKey("VITE_NEC_VOTE_KEY");
  if (!key) return [];
  const res = await necFetch<VoteRaw>({
    service: "VoteXmntckInfoInqireService2",
    method: "getVoteSttusInfoInqire",
    serviceKey: key,
    params: {
      sgId: opts.sgId,
      sgTypecode: opts.sgTypecode,
      sdName: opts.sdName,
      wiwName: opts.wiwName,
      pageNo: opts.pageNo ?? 1,
      numOfRows: opts.numOfRows ?? 100,
    },
  });
  return res.items.map(normalize);
}
