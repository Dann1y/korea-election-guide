// 9회 지방선거 등록 가능 정당을 모두 포괄.
// 색상은 정당 공식 색 또는 보편 사용 색.
export type PartyCode =
  | "dp" // 더불어민주당
  | "ppp" // 국민의힘
  | "rp" // 개혁신당
  | "jp" // 정의당 / 사회민주당 계열
  | "npp" // 진보당
  | "gjp" // 녹색정의당
  | "wp" // 여성의당
  | "ftu" // 자유통일당
  | "lp" // 노동당
  | "bip" // 기본소득당
  | "ind" // 무소속
  | "etc";

export interface Party {
  code: PartyCode;
  name: string;
  shortName: string;
  color: string;
}

export type ElectionLevel =
  | "metro" // 광역단체장
  | "basic" // 기초단체장
  | "metro_council" // 광역의원
  | "basic_council" // 기초의원
  | "edu"; // 교육감

export type ElectionYear = 2014 | 2018 | 2022 | 2026;

export interface RegionMeta {
  code: string; // ISO-3166-2 KR. 예: "KR-11" (서울)
  name: string;
  shortName: string;
  englishName: string;
  level: ElectionLevel;
  parentCode?: string;
  // NEC API가 반환하는 sdName 값. 행정구역 통합(예: 전남광주통합특별시)이나
  // 명칭 변경(전라북도 → 전북특별자치도) 등을 흡수.
  necSdName?: string;
}

export interface Pledge {
  id: string;
  title: string;
  category: string;
  summary: string;
  status?: "completed" | "in_progress" | "partial" | "abandoned" | "unknown";
  evidence?: string;
}

export interface Controversy {
  id: string;
  date: string;
  title: string;
  summary: string;
  severity: "low" | "medium" | "high";
  resolved?: boolean;
  source?: string;
}

export interface CandidateBase {
  id: string;
  name: string;
  hanja?: string;
  party: PartyCode;
  partyNameRaw?: string;
  age?: number;
  gender?: "M" | "F";
  career?: string[];
  education?: string;
  photoUrl?: string;
}

export interface HistoricalCandidate extends CandidateBase {
  electionYear: ElectionYear;
  regionCode: string;
  isWinner: boolean;
  voteCount?: number;
  voteShare?: number;
  rank?: number;
  pledges: Pledge[];
  controversies: Controversy[];
  termAssessment?: {
    overallScore: number;
    pledgeFulfillmentRate?: number;
    approvalRate?: number;
    summary: string;
    sourceNotes?: string;
  };
}

export interface CurrentCandidate extends CandidateBase {
  electionYear: 2026;
  regionCode: string;
  electionLevel?: ElectionLevel;
  pledges: Pledge[];
  previousTerm?: {
    year: ElectionYear;
    regionCode: string;
    termAssessment?: HistoricalCandidate["termAssessment"];
    pledgeFulfillmentRate?: number;
  };
  pollingShare?: number; // 최근 여론조사 지지율 (있을 경우)
  // 후보자 확정 단계.
  // "confirmed" = NEC 등록 완료, "primary" = 당내 경선 중, "unknown" = 미확정.
  registrationStatus?: "confirmed" | "primary" | "unknown";
  // 보수/진보 진영 (교육감처럼 무공천 선거 표시용)
  ideology?: "progressive" | "conservative" | "centrist";
  note?: string;
}

// 교육감 후보 (정당 공천 없음 → ideology만 사용)
export interface EducationCandidate
  extends Omit<CurrentCandidate, "party" | "electionLevel"> {
  electionLevel: "edu";
  party: "ind";
  ideology: "progressive" | "conservative" | "centrist";
}

export interface RegionResult {
  regionCode: string;
  electionYear: ElectionYear;
  winnerCandidateId?: string;
  candidates: HistoricalCandidate[] | CurrentCandidate[];
}
