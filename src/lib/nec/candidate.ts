// 후보자 정보 (PofelcddInfoInqireService)
// 데이터셋 15000908 — https://www.data.go.kr/data/15000908/openapi.do
//
// 메서드:
//   getPofelcddRegistSttusInfoInqire — 본후보 등록상태 (★ 사용)
//   getPoelpcddRegistSttusInfoInqire — 예비후보 등록상태 (사용 안 함)
//
// 응답 필드: huboid (후보 ID, 공약 API에 사용), name, jdName(정당), giho(기호) 등.

import { getKey, necFetch } from "./client";

interface CandidateRaw {
  num?: string;
  sgId?: string;
  sgTypecode?: string;
  huboid?: string; // 후보 ID — 공약 API에 필수
  giho?: string;
  gihoSangse?: string;
  jdName?: string;
  name?: string;
  hanjaName?: string;
  gender?: string;
  birthday?: string;
  age?: string;
  addr?: string;
  jobId?: string;
  job?: string;
  eduId?: string;
  edu?: string;
  career1?: string;
  career2?: string;
  status?: string;
  sggName?: string;
  sdName?: string;
  wiwName?: string;
}

export interface NECCandidate {
  huboid: string;
  num: number;
  giho?: string;
  party?: string;
  name: string;
  hanja?: string;
  gender?: "M" | "F";
  birthday?: string;
  age?: number;
  education?: string;
  job?: string;
  careers: string[];
  address?: string;
  status?: string;
  sgId: string;
  sgTypecode: string;
  sggName?: string;
  sdName?: string;
  wiwName?: string;
}

function normalize(r: CandidateRaw): NECCandidate {
  return {
    huboid: r.huboid ?? "",
    num: Number(r.num ?? 0),
    giho: r.giho,
    party: r.jdName,
    name: r.name ?? "",
    hanja: r.hanjaName,
    gender: r.gender === "남" ? "M" : r.gender === "여" ? "F" : undefined,
    birthday: r.birthday,
    age: r.age ? Number(r.age) : undefined,
    education: r.edu,
    job: r.job,
    careers: [r.career1, r.career2].filter(Boolean) as string[],
    address: r.addr,
    status: r.status,
    sgId: r.sgId ?? "",
    sgTypecode: r.sgTypecode ?? "",
    sggName: r.sggName,
    sdName: r.sdName,
    wiwName: r.wiwName,
  };
}

export interface FetchCandidateOpts {
  sgId: string;
  sgTypecode: string;
  sdName?: string;
  sggName?: string;
  pageNo?: number;
  numOfRows?: number;
}

export async function fetchCandidatesPage(
  opts: FetchCandidateOpts,
): Promise<{ items: NECCandidate[]; totalCount: number }> {
  const key = getKey("VITE_NEC_CANDIDATE_KEY");
  if (!key) return { items: [], totalCount: 0 };
  const res = await necFetch<CandidateRaw>({
    service: "PofelcddInfoInqireService",
    method: "getPofelcddRegistSttusInfoInqire",
    serviceKey: key,
    params: {
      sgId: opts.sgId,
      sgTypecode: opts.sgTypecode,
      sdName: opts.sdName,
      sggName: opts.sggName,
      pageNo: opts.pageNo ?? 1,
      numOfRows: opts.numOfRows ?? 100,
    },
  });
  return { items: res.items.map(normalize), totalCount: res.totalCount };
}

export async function fetchAllCandidates(
  opts: Omit<FetchCandidateOpts, "pageNo">,
): Promise<NECCandidate[]> {
  const numOfRows = opts.numOfRows ?? 100;
  let first;
  try {
    first = await fetchCandidatesPage({ ...opts, pageNo: 1, numOfRows });
  } catch (e) {
    if (String(e).includes("INFO-03")) return [];
    throw e;
  }
  if (first.items.length === 0) return [];
  const pages = Math.ceil(first.totalCount / numOfRows);
  if (pages <= 1) return first.items;
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) =>
      fetchCandidatesPage({ ...opts, pageNo: i + 2, numOfRows }).catch((e) => {
        if (String(e).includes("INFO-03")) return { items: [], totalCount: 0 };
        throw e;
      }),
    ),
  );
  return [...first.items, ...rest.flatMap((r) => r.items)];
}

// 17개 시·도 전체를 분할 호출. NEC API가 sdName 없으면 INFO-03을 반환하는 케이스 대응.
// 동시성 4로 묶어 호출.
const ALL_SDO = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

export async function fetchCandidatesAllSdo(opts: {
  sgId: string;
  sgTypecode: string;
  concurrency?: number;
  numOfRows?: number;
}): Promise<NECCandidate[]> {
  const concurrency = opts.concurrency ?? 4;
  const all: NECCandidate[] = [];
  for (let i = 0; i < ALL_SDO.length; i += concurrency) {
    const batch = ALL_SDO.slice(i, i + concurrency);
    const groups = await Promise.all(
      batch.map((sdName) =>
        fetchAllCandidates({
          sgId: opts.sgId,
          sgTypecode: opts.sgTypecode,
          sdName,
          numOfRows: opts.numOfRows ?? 100,
        }),
      ),
    );
    for (const g of groups) all.push(...g);
  }
  return all;
}
