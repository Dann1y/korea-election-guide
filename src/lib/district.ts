// 행정구역 매칭 헬퍼.
// NEC API는 wiwName을 두 가지 패턴으로 반환:
//   - 광역시 자치구: "종로구", "강남구", "수영구" 등
//   - 도 시·군·구: "고양시덕양구", "성남시분당구", "용인시기흥구" 등
// 기초단체장은 "시" 단위 1명이라 도 지역에서 시민 wiwName과 정확 매칭이 안 됨.

import type { NECCandidate, NECWinner } from "@/lib/nec";

// "고양시일산동구" → "고양시"
// "성남시분당구" → "성남시"
// "수원시"      → "수원시"
// "종로구"      → "종로구" (시 없음)
export function extractCityName(wiwName: string): string {
  if (!wiwName) return "";
  const m = wiwName.match(/^(.+?시)(.+(?:구|읍|면))?$/);
  return m ? m[1] : wiwName;
}

// 기초단체장 매칭: 시민 wiwName과 NEC 응답 sgg/wiw 양쪽 검사.
// 광역시 자치구는 wiwName 정확 매칭, 도 시·군·구는 "시" 단위 매칭.
export function matchBasicHead(
  candidate: NECCandidate | NECWinner,
  userWiwName: string,
): boolean {
  if (!userWiwName) return false;
  // 1) wiwName 정확 매칭 (광역시 자치구)
  if (candidate.wiwName === userWiwName) return true;
  // 2) sggName 정확 매칭
  if (candidate.sggName === userWiwName) return true;
  // 3) 시 단위 매칭 (도 지역: "고양시일산동구" → 고양시 시장)
  const city = extractCityName(userWiwName);
  if (!city || city === userWiwName) return false;
  if (candidate.sggName === city) return true;
  if (candidate.wiwName && candidate.wiwName.startsWith(city)) return true;
  return false;
}

// 광역의원·기초의원 매칭: NEC가 행정구별로 wiwName을 정확히 분리해두므로
// wiwName 정확 매칭이면 충분.
export function matchByWiwExact(
  candidate: NECCandidate | NECWinner,
  userWiwName: string,
): boolean {
  if (!userWiwName) return true;
  return candidate.wiwName === userWiwName;
}
