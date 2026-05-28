import type { Party, PartyCode } from "@/types";

// 9회 지방선거 등록 가능 주요 정당.
// 색상: 각 당 공식 또는 보편 사용 색 (위키피디아·언론 표기 기준).
export const parties: Record<PartyCode, Party> = {
  dp: {
    code: "dp",
    name: "더불어민주당",
    shortName: "민주",
    color: "#152484",
  },
  ppp: {
    code: "ppp",
    name: "국민의힘",
    shortName: "국힘",
    color: "#E61E2B",
  },
  rp: {
    code: "rp",
    name: "개혁신당",
    shortName: "개혁",
    color: "#FF7920",
  },
  jp: {
    code: "jp",
    name: "정의당",
    shortName: "정의",
    color: "#FFCC00",
  },
  npp: {
    code: "npp",
    name: "진보당",
    shortName: "진보",
    color: "#D6001C",
  },
  gjp: {
    code: "gjp",
    name: "녹색정의당",
    shortName: "녹정",
    color: "#5BC500",
  },
  wp: {
    code: "wp",
    name: "여성의당",
    shortName: "여성",
    color: "#B72D71",
  },
  ftu: {
    code: "ftu",
    name: "자유통일당",
    shortName: "자유통일",
    color: "#003478",
  },
  lp: {
    code: "lp",
    name: "노동당",
    shortName: "노동",
    color: "#FC0001",
  },
  bip: {
    code: "bip",
    name: "기본소득당",
    shortName: "기본",
    color: "#00B6B0",
  },
  ind: {
    code: "ind",
    name: "무소속",
    shortName: "무소속",
    color: "#8b8ba8",
  },
  etc: {
    code: "etc",
    name: "기타",
    shortName: "기타",
    color: "#5b5b76",
  },
};

export function getParty(code: PartyCode): Party {
  return parties[code] ?? parties.etc;
}

// 회차별 정당명 변천 (표시용)
export const historicalPartyNames: Record<
  PartyCode,
  Partial<Record<2014 | 2018 | 2022 | 2026, string>>
> = {
  dp: {
    2014: "새정치민주연합",
    2018: "더불어민주당",
    2022: "더불어민주당",
    2026: "더불어민주당",
  },
  ppp: {
    2014: "새누리당",
    2018: "자유한국당",
    2022: "국민의힘",
    2026: "국민의힘",
  },
  jp: { 2014: "정의당", 2018: "정의당", 2022: "정의당", 2026: "정의당" },
  rp: { 2026: "개혁신당" },
  npp: { 2022: "진보당", 2026: "진보당" },
  gjp: { 2026: "녹색정의당" },
  wp: { 2026: "여성의당" },
  ftu: { 2026: "자유통일당" },
  lp: { 2026: "노동당" },
  bip: { 2026: "기본소득당" },
  ind: { 2014: "무소속", 2018: "무소속", 2022: "무소속", 2026: "무소속" },
  etc: {},
};
