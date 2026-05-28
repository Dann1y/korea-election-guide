// 코드 정보 (CommonCodeService)
// 데이터셋 15000897 — https://www.data.go.kr/data/15000897/openapi.do
// 용도: sgId (선거ID) + sgTypecode (선거종류코드) 매핑 조회.
// 다른 모든 API의 호출에 필요한 기반 키.

import { getKey, necFetch } from "./client";

interface SgCodeRaw {
  num?: string;
  sgId?: string;
  sgTypecode?: string;
  sgName?: string;
  sgVotedate?: string; // YYYYMMDD
}

export interface SgCode {
  num: number;
  sgId: string;
  sgTypecode: string;
  sgName: string;
  voteDate: string; // ISO yyyy-mm-dd
  voteYear: number;
}

function normalize(r: SgCodeRaw): SgCode {
  const y = r.sgVotedate ? r.sgVotedate.slice(0, 4) : "0000";
  const m = r.sgVotedate ? r.sgVotedate.slice(4, 6) : "01";
  const d = r.sgVotedate ? r.sgVotedate.slice(6, 8) : "01";
  return {
    num: Number(r.num ?? 0),
    sgId: r.sgId ?? "",
    sgTypecode: r.sgTypecode ?? "",
    sgName: r.sgName ?? "",
    voteDate: `${y}-${m}-${d}`,
    voteYear: Number(y),
  };
}

export async function fetchSgCodes(opts?: {
  pageNo?: number;
  numOfRows?: number;
}): Promise<SgCode[]> {
  const key = getKey("VITE_NEC_CODE_KEY");
  if (!key) return [];

  // 코드 정보 API는 numOfRows 100 한도. 전체 수집은 fetchAllSgCodes 사용.
  const res = await necFetch<SgCodeRaw>({
    service: "CommonCodeService",
    method: "getCommonSgCodeList",
    serviceKey: key,
    params: {
      pageNo: opts?.pageNo ?? 1,
      numOfRows: opts?.numOfRows ?? 100,
    },
  });
  return res.items.map(normalize);
}

// 전체 페이지 자동 수집
export async function fetchAllSgCodes(): Promise<SgCode[]> {
  const key = getKey("VITE_NEC_CODE_KEY");
  if (!key) return [];
  // numOfRows 100 한도 가정. 1페이지 fetch → totalCount로 페이지 수 계산
  const first = await necFetch<SgCodeRaw>({
    service: "CommonCodeService",
    method: "getCommonSgCodeList",
    serviceKey: key,
    params: { pageNo: 1, numOfRows: 100 },
  });
  const total = first.totalCount;
  const pages = Math.ceil(total / 100);
  if (pages <= 1) return first.items.map(normalize);
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) =>
      necFetch<SgCodeRaw>({
        service: "CommonCodeService",
        method: "getCommonSgCodeList",
        serviceKey: key,
        params: { pageNo: i + 2, numOfRows: 100 },
      }),
    ),
  );
  const all = [...first.items, ...rest.flatMap((r) => r.items)];
  return all.map(normalize);
}

// 회차별 sgId (코드 정보 API 확인 결과).
export const LOCAL_ELECTION_SG_IDS = {
  3: "20020613", // 3회 (2002)
  4: "20060531", // 4회 (2006)
  5: "20100602", // 5회 (2010)
  6: "20140604", // 6회 (2014)
  7: "20180613", // 7회 (2018)
  8: "20220601", // 8회 (2022)
  9: "20260603", // 9회 (2026)
} as const;

export async function find9thLocalElectionId(): Promise<SgCode | undefined> {
  const codes = await fetchAllSgCodes();
  return codes.find(
    (c) => c.voteDate === "2026-06-03" && c.sgName.includes("전국동시지방선거"),
  );
}

export async function find8thLocalElectionId(): Promise<SgCode | undefined> {
  const codes = await fetchAllSgCodes();
  return codes.find(
    (c) => c.voteDate === "2022-06-01" && c.sgName.includes("전국동시지방선거"),
  );
}

// 선거종류코드 카탈로그 — 9회(2026) 실응답 검증 기반.
// 코드 정보 API가 403이라 PofelcddInfoInqireService 응답으로 직접 확인.
export const SG_TYPE_LABELS: Record<string, string> = {
  "1": "대통령선거",
  "2": "국회의원선거",
  "3": "광역단체장 (시·도지사)",
  "4": "기초단체장 (시장·군수·구청장)",
  "5": "광역의원 (지역구)",
  "6": "기초의원 (지역구)",
  "8": "광역의원 (비례대표)",
  "9": "기초의원 (비례대표)",
  "11": "교육감",
};

// 9회(2026) 지방선거에서 시민이 실제 받는 투표용지 sgTypecode
export const LOCAL_2026_SG_TYPES = ["3", "4", "5", "6", "8", "9", "11"] as const;
export type LocalSgType = (typeof LOCAL_2026_SG_TYPES)[number];
