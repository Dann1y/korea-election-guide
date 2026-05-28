// 선거공약 정보 (ElecPrmsInfoInqireService)
// 데이터셋 15040587 — https://www.data.go.kr/data/15040587/openapi.do
//
// 주의: 6·3 이전엔 모든 후보 공약 조회 가능, 6·3 이후엔 당선자 공약만.
// 후보자 정보 API의 huboid를 cnddtId 자리에 넣어 호출.

import { getKey, necFetch } from "./client";

interface PledgeRaw {
  num?: string;
  cnddtId?: string;
  huboid?: string;
  krName?: string;
  prmsCnt?: string;
  [key: string]: string | undefined;
}

export interface NECPledge {
  order: number;
  realm?: string;
  title: string;
  content?: string;
}

export interface NECCandidatePledges {
  cnddtId: string;
  krName: string;
  prmsCnt: number;
  pledges: NECPledge[];
}

function normalize(r: PledgeRaw): NECCandidatePledges {
  const pledges: NECPledge[] = [];
  for (let i = 1; i <= 10; i++) {
    const title = r[`prmsTitle${i}`];
    if (!title) continue;
    pledges.push({
      order: Number(r[`prmsOrd${i}`] ?? i),
      realm: r[`prmsRealmName${i}`],
      title,
      content: r[`prmsCont${i}`],
    });
  }
  return {
    cnddtId: r.cnddtId ?? r.huboid ?? "",
    krName: r.krName ?? "",
    prmsCnt: Number(r.prmsCnt ?? pledges.length),
    pledges,
  };
}

export interface FetchPledgeOpts {
  sgId: string;
  sgTypecode: string;
  cnddtId: string; // 후보자 정보의 huboid 값
}

export async function fetchPledges(
  opts: FetchPledgeOpts,
): Promise<NECCandidatePledges | undefined> {
  const key = getKey("VITE_NEC_PLEDGE_KEY");
  if (!key) return undefined;
  try {
    const res = await necFetch<PledgeRaw>({
      service: "ElecPrmsInfoInqireService",
      method: "getCnddtElecPrmsInfoInqire",
      serviceKey: key,
      params: {
        sgId: opts.sgId,
        sgTypecode: opts.sgTypecode,
        cnddtId: opts.cnddtId,
        pageNo: 1,
        numOfRows: 10,
      },
    });
    if (res.items.length === 0) return undefined;
    return normalize(res.items[0]);
  } catch (e) {
    // 공약 미제출 후보는 INFO-03 → 무시
    if (String(e).includes("INFO-03")) return undefined;
    throw e;
  }
}

export async function fetchPledgesBatch(
  opts: { sgId: string; sgTypecode: string },
  cnddtIds: string[],
  concurrency = 4,
): Promise<Map<string, NECCandidatePledges>> {
  const result = new Map<string, NECCandidatePledges>();
  for (let i = 0; i < cnddtIds.length; i += concurrency) {
    const batch = cnddtIds.slice(i, i + concurrency);
    const items = await Promise.all(
      batch.map((id) =>
        fetchPledges({ ...opts, cnddtId: id }).catch(() => undefined),
      ),
    );
    items.forEach((it, j) => {
      if (it) result.set(batch[j], it);
    });
  }
  return result;
}
