// 현역 vs 신입 판별 + 신입 후보의 외부 정보 검색 링크.
// 현역 판별 로직: career1/career2 텍스트에서 "현)" 패턴 또는
// 8회 당선자 명단(useWinners)에 huboid/name 매칭으로 결정.

import { ExternalLink, History, Newspaper, Sparkles } from "lucide-react";
import type { NECCandidate, NECWinner } from "@/lib/nec";
import { cn } from "@/lib/cn";

interface Props {
  candidate: NECCandidate;
  prevWinners: NECWinner[]; // 같은 sgTypecode·sdName의 2022 당선자
  prevWiwName?: string;
  prevSggName?: string;
}

// 공직 키워드 — 현역 판정 시 정당 직책("(현)민주당 대변인")과 구분.
const PUBLIC_OFFICE_KEYWORDS = [
  "시장",
  "지사",
  "도지사",
  "구청장",
  "군수",
  "교육감",
  "시·도의원",
  "도의원",
  "시의원",
  "구의원",
  "군의원",
  "광역의원",
  "기초의원",
  "국회의원",
];

export function IncumbentBadge({ candidate, prevWinners }: Props) {
  // 1순위(가장 신뢰): NEC 8회 당선자 명단 매칭
  const matchedWinner = prevWinners.find(
    (w) =>
      w.name === candidate.name &&
      (!candidate.sdName || w.sdName === candidate.sdName) &&
      (!candidate.wiwName || !w.wiwName || w.wiwName === candidate.wiwName),
  );
  // 2순위: career에 "(현)" + 공직 키워드가 동시에 있는 경우만
  const careerIncumbent = candidate.careers.some((c) => {
    const isHyun =
      c.startsWith("(현)") || c.startsWith("(현 ") || c.includes("현직");
    if (!isHyun) return false;
    return PUBLIC_OFFICE_KEYWORDS.some((kw) => c.includes(kw));
  });
  const isIncumbent = !!matchedWinner || careerIncumbent;

  if (isIncumbent) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border font-medium",
          "border-amber-400/40 bg-amber-400/10 text-amber-300",
        )}
      >
        <History className="w-3 h-3" />
        현역
        {matchedWinner?.voteShare !== undefined ? (
          <span className="tabular-nums">
            · 2022 {(matchedWinner.voteShare * 100).toFixed(1)}%
          </span>
        ) : null}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border font-medium",
        "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
      )}
    >
      <Sparkles className="w-3 h-3" />
      신규 출마
    </span>
  );
}

// 신입 후보 외부 정보 검색 링크 (Google News + NEC info)
export function NewcomerLinks({ name }: { name: string }) {
  const encoded = encodeURIComponent(`"${name}" 2026 지방선거`);
  return (
    <div className="flex flex-wrap gap-1.5 text-[10px]">
      <a
        href={`https://news.google.com/search?q=${encoded}`}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-ink-200 hover:text-ink-100 hover:border-white/20 transition"
      >
        <Newspaper className="w-3 h-3" />
        뉴스 검색
        <ExternalLink className="w-2.5 h-2.5" />
      </a>
      <a
        href={`https://info.nec.go.kr/main/main_load.xhtml`}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-ink-200 hover:text-ink-100 hover:border-white/20 transition"
      >
        <ExternalLink className="w-2.5 h-2.5" />
        NEC 후보 상세
      </a>
    </div>
  );
}
