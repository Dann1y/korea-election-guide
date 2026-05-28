import type {
  CurrentCandidate,
  EducationCandidate,
  ElectionYear,
  HistoricalCandidate,
  RegionResult,
} from "@/types";
import { candidates2014 } from "./elections/2014";
import { candidates2018 } from "./elections/2018";
import { candidates2022 } from "./elections/2022";
import { candidates2026 } from "./elections/2026";
import {
  eduCandidates2026,
  eduElectionsPending,
} from "./elections/2026_edu";

export { eduCandidates2026, eduElectionsPending };

export const allHistoricalCandidates: HistoricalCandidate[] = [
  ...candidates2014,
  ...candidates2018,
  ...candidates2022,
];

export const allCurrentCandidates: CurrentCandidate[] = candidates2026;

export const electionYears: ElectionYear[] = [2014, 2018, 2022, 2026];

export function getHistoricalByYear(
  year: ElectionYear,
): HistoricalCandidate[] {
  return allHistoricalCandidates.filter((c) => c.electionYear === year);
}

export function getCurrentByRegion(regionCode: string): CurrentCandidate[] {
  return allCurrentCandidates.filter((c) => c.regionCode === regionCode);
}

export function getEduCandidatesByRegion(
  regionCode: string,
): EducationCandidate[] {
  return eduCandidates2026.filter((c) => c.regionCode === regionCode);
}

export function getHistoricalByRegion(
  regionCode: string,
  year?: ElectionYear,
): HistoricalCandidate[] {
  return allHistoricalCandidates.filter(
    (c) =>
      c.regionCode === regionCode && (year ? c.electionYear === year : true),
  );
}

export function getRegionWinner(
  regionCode: string,
  year: ElectionYear,
): HistoricalCandidate | undefined {
  return allHistoricalCandidates.find(
    (c) => c.regionCode === regionCode && c.electionYear === year && c.isWinner,
  );
}

export function buildRegionResults(year: ElectionYear): RegionResult[] {
  if (year === 2026) {
    const grouped = new Map<string, CurrentCandidate[]>();
    for (const c of allCurrentCandidates) {
      const list = grouped.get(c.regionCode) ?? [];
      list.push(c);
      grouped.set(c.regionCode, list);
    }
    return [...grouped.entries()].map(([regionCode, candidates]) => ({
      regionCode,
      electionYear: 2026,
      candidates,
    }));
  }
  const grouped = new Map<string, HistoricalCandidate[]>();
  for (const c of allHistoricalCandidates.filter(
    (c) => c.electionYear === year,
  )) {
    const list = grouped.get(c.regionCode) ?? [];
    list.push(c);
    grouped.set(c.regionCode, list);
  }
  return [...grouped.entries()].map(([regionCode, candidates]) => ({
    regionCode,
    electionYear: year,
    winnerCandidateId: candidates.find((c) => c.isWinner)?.id,
    candidates,
  }));
}
