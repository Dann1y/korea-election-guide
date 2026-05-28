import type { RegionMeta } from "@/types";

// 17개 광역시·도. code는 ISO-3166-2:KR 기준.
// necSdName은 NEC API가 실제 반환하는 시·도명 (행정구역 변경/통합 반영).
export const metroRegions: RegionMeta[] = [
  {
    code: "KR-11",
    name: "서울특별시",
    shortName: "서울",
    englishName: "Seoul",
    level: "metro",
    necSdName: "서울특별시",
  },
  {
    code: "KR-26",
    name: "부산광역시",
    shortName: "부산",
    englishName: "Busan",
    level: "metro",
    necSdName: "부산광역시",
  },
  {
    code: "KR-27",
    name: "대구광역시",
    shortName: "대구",
    englishName: "Daegu",
    level: "metro",
    necSdName: "대구광역시",
  },
  {
    code: "KR-28",
    name: "인천광역시",
    shortName: "인천",
    englishName: "Incheon",
    level: "metro",
    necSdName: "인천광역시",
  },
  {
    code: "KR-29",
    name: "광주광역시",
    shortName: "광주",
    englishName: "Gwangju",
    level: "metro",
    // 9회(2026) 기준 NEC가 광주·전남을 통합광역으로 분류.
    necSdName: "전남광주통합특별시",
  },
  {
    code: "KR-30",
    name: "대전광역시",
    shortName: "대전",
    englishName: "Daejeon",
    level: "metro",
    necSdName: "대전광역시",
  },
  {
    code: "KR-31",
    name: "울산광역시",
    shortName: "울산",
    englishName: "Ulsan",
    level: "metro",
    necSdName: "울산광역시",
  },
  {
    code: "KR-50",
    name: "세종특별자치시",
    shortName: "세종",
    englishName: "Sejong",
    level: "metro",
    necSdName: "세종특별자치시",
  },
  {
    code: "KR-41",
    name: "경기도",
    shortName: "경기",
    englishName: "Gyeonggi",
    level: "metro",
    necSdName: "경기도",
  },
  {
    code: "KR-42",
    name: "강원특별자치도",
    shortName: "강원",
    englishName: "Gangwon",
    level: "metro",
    necSdName: "강원특별자치도",
  },
  {
    code: "KR-43",
    name: "충청북도",
    shortName: "충북",
    englishName: "Chungbuk",
    level: "metro",
    necSdName: "충청북도",
  },
  {
    code: "KR-44",
    name: "충청남도",
    shortName: "충남",
    englishName: "Chungnam",
    level: "metro",
    necSdName: "충청남도",
  },
  {
    code: "KR-45",
    name: "전북특별자치도",
    shortName: "전북",
    englishName: "Jeonbuk",
    level: "metro",
    necSdName: "전북특별자치도",
  },
  {
    code: "KR-46",
    name: "전라남도",
    shortName: "전남",
    englishName: "Jeonnam",
    level: "metro",
    // 9회(2026) 기준 NEC가 광주·전남을 통합광역으로 분류.
    necSdName: "전남광주통합특별시",
  },
  {
    code: "KR-47",
    name: "경상북도",
    shortName: "경북",
    englishName: "Gyeongbuk",
    level: "metro",
    necSdName: "경상북도",
  },
  {
    code: "KR-48",
    name: "경상남도",
    shortName: "경남",
    englishName: "Gyeongnam",
    level: "metro",
    necSdName: "경상남도",
  },
  {
    code: "KR-49",
    name: "제주특별자치도",
    shortName: "제주",
    englishName: "Jeju",
    level: "metro",
    necSdName: "제주특별자치도",
  },
];

export const regionByCode = new Map(metroRegions.map((r) => [r.code, r]));

export function getRegion(code: string): RegionMeta | undefined {
  return regionByCode.get(code);
}

export function getNECSdName(code: string): string | undefined {
  return regionByCode.get(code)?.necSdName;
}
