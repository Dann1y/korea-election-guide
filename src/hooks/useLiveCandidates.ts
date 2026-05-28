// 광역단체장 / 기초단체장 / 교육감 등 sgTypecode별 후보를 NEC API에서 가져오는 hook.
// sessionStorage로 페이지 새로고침 간 캐시. 메모리에도 promise 캐시.

import { useEffect, useState } from "react";
import {
  fetchAllCandidates,
  fetchPledges,
  type NECCandidate,
  type NECCandidatePledges,
} from "@/lib/nec";

const memCache = new Map<string, Promise<NECCandidate[]>>();
const pledgeMemCache = new Map<string, Promise<NECCandidatePledges | undefined>>();

const cacheKey = (sgId: string, sgTypecode: string, sdName?: string) =>
  `nec:cands:${sgId}:${sgTypecode}:${sdName ?? "ALL"}`;

const pledgeCacheKey = (sgId: string, sgTypecode: string, huboid: string) =>
  `nec:pledge:${sgId}:${sgTypecode}:${huboid}`;

function readSession<T>(key: string): T | undefined {
  if (typeof sessionStorage === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

function writeSession<T>(key: string, value: T): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 용량 초과 등은 무시
  }
}

export function getCandidates(
  sgId: string,
  sgTypecode: string,
  sdName?: string,
): Promise<NECCandidate[]> {
  const key = cacheKey(sgId, sgTypecode, sdName);
  if (memCache.has(key)) return memCache.get(key)!;
  const cached = readSession<NECCandidate[]>(key);
  if (cached) {
    const p = Promise.resolve(cached);
    memCache.set(key, p);
    return p;
  }
  const p = fetchAllCandidates({ sgId, sgTypecode, sdName })
    .then((list) => {
      writeSession(key, list);
      return list;
    })
    .catch((e) => {
      memCache.delete(key);
      throw e;
    });
  memCache.set(key, p);
  return p;
}

export function getPledges(
  sgId: string,
  sgTypecode: string,
  huboid: string,
): Promise<NECCandidatePledges | undefined> {
  const key = pledgeCacheKey(sgId, sgTypecode, huboid);
  if (pledgeMemCache.has(key)) return pledgeMemCache.get(key)!;
  const cached = readSession<NECCandidatePledges>(key);
  if (cached) {
    const p = Promise.resolve(cached);
    pledgeMemCache.set(key, p);
    return p;
  }
  const p = fetchPledges({ sgId, sgTypecode, cnddtId: huboid })
    .then((r) => {
      if (r) writeSession(key, r);
      return r;
    })
    .catch((e) => {
      pledgeMemCache.delete(key);
      throw e;
    });
  pledgeMemCache.set(key, p);
  return p;
}

interface State {
  loading: boolean;
  candidates: NECCandidate[];
  error?: string;
}

// sgId/sgTypecode/sdName이 모두 truthy일 때만 호출.
export function useCandidates(
  sgId: string | undefined,
  sgTypecode: string | undefined,
  sdName: string | undefined,
): State {
  const [state, setState] = useState<State>({
    loading: !!(sgId && sgTypecode && sdName),
    candidates: [],
  });

  useEffect(() => {
    if (!sgId || !sgTypecode || !sdName) {
      setState({ loading: false, candidates: [] });
      return;
    }
    let cancelled = false;
    setState({ loading: true, candidates: [] });
    getCandidates(sgId, sgTypecode, sdName)
      .then((list) => {
        if (cancelled) return;
        setState({ loading: false, candidates: list });
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setState({
          loading: false,
          candidates: [],
          error: e.message,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [sgId, sgTypecode, sdName]);

  return state;
}

interface PledgeState {
  loading: boolean;
  data?: NECCandidatePledges;
  error?: string;
}

export function usePledges(
  sgId: string | undefined,
  sgTypecode: string | undefined,
  huboid: string | undefined,
): PledgeState {
  const [state, setState] = useState<PledgeState>({
    loading: !!(sgId && sgTypecode && huboid),
  });
  useEffect(() => {
    if (!sgId || !sgTypecode || !huboid) {
      setState({ loading: false });
      return;
    }
    let cancelled = false;
    setState({ loading: true });
    getPledges(sgId, sgTypecode, huboid)
      .then((data) => {
        if (cancelled) return;
        setState({ loading: false, data });
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setState({ loading: false, error: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, [sgId, sgTypecode, huboid]);
  return state;
}
