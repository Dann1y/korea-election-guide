// 8회(2022) 또는 임의 회차 당선자 정보를 NEC API에서 가져오는 hook.
// 시·도 단위 또는 전국 단위 캐시.

import { useEffect, useState } from "react";
import { fetchWinners, type NECWinner } from "@/lib/nec";

const memCache = new Map<string, Promise<NECWinner[]>>();

const cacheKey = (sgId: string, sgTypecode: string, sdName?: string) =>
  `nec:winners:${sgId}:${sgTypecode}:${sdName ?? "ALL"}`;

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
    /* noop */
  }
}

export function getWinners(
  sgId: string,
  sgTypecode: string,
  sdName?: string,
): Promise<NECWinner[]> {
  const key = cacheKey(sgId, sgTypecode, sdName);
  if (memCache.has(key)) return memCache.get(key)!;
  const cached = readSession<NECWinner[]>(key);
  if (cached) {
    const p = Promise.resolve(cached);
    memCache.set(key, p);
    return p;
  }
  const p = fetchWinners({ sgId, sgTypecode, sdName, numOfRows: 200 })
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

interface State {
  loading: boolean;
  winners: NECWinner[];
  error?: string;
}

export function useWinners(
  sgId: string | undefined,
  sgTypecode: string | undefined,
  sdName: string | undefined,
): State {
  const [state, setState] = useState<State>({
    loading: !!(sgId && sgTypecode),
    winners: [],
  });

  useEffect(() => {
    if (!sgId || !sgTypecode) {
      setState({ loading: false, winners: [] });
      return;
    }
    let cancelled = false;
    setState({ loading: true, winners: [] });
    getWinners(sgId, sgTypecode, sdName)
      .then((list) => {
        if (cancelled) return;
        setState({ loading: false, winners: list });
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setState({ loading: false, winners: [], error: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, [sgId, sgTypecode, sdName]);

  return state;
}
