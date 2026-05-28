// 시민이 입력한 "내 지역구" — localStorage 저장.
// 시·도 코드(예: "KR-11") + 자치구명(예: "성동구") 조합.
// 세종·제주 같이 기초자치단체가 없는 경우 wiwName은 빈 문자열.

import { useEffect, useState } from "react";

const STORAGE_KEY = "myDistrict.v1";

export interface MyDistrict {
  regionCode: string; // KR-11
  wiwName: string; // "성동구" (광역만 적용되면 "")
  setAt: string; // ISO
}

function read(): MyDistrict | undefined {
  if (typeof localStorage === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as MyDistrict;
    if (!parsed.regionCode) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

function write(value: MyDistrict | undefined): void {
  if (typeof localStorage === "undefined") return;
  if (!value) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function useMyDistrict(): {
  district: MyDistrict | undefined;
  set: (regionCode: string, wiwName: string) => void;
  clear: () => void;
} {
  const [district, setDistrict] = useState<MyDistrict | undefined>(() => read());

  // 다른 탭 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setDistrict(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const set = (regionCode: string, wiwName: string) => {
    const next: MyDistrict = {
      regionCode,
      wiwName,
      setAt: new Date().toISOString(),
    };
    write(next);
    setDistrict(next);
  };

  const clear = () => {
    write(undefined);
    setDistrict(undefined);
  };

  return { district, set, clear };
}
