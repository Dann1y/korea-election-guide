import { Award, TrendingUp, User } from "lucide-react";
import type {
  CurrentCandidate,
  HistoricalCandidate,
} from "@/types";
import { getParty, historicalPartyNames } from "@/data/parties";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PledgeList } from "./PledgeList";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/cn";

interface Props {
  candidate: HistoricalCandidate | CurrentCandidate;
  variant?: "historical" | "current";
  compact?: boolean;
}

export function CandidateCard({ candidate, variant, compact }: Props) {
  const party = getParty(candidate.party);
  const isHistorical = "isWinner" in candidate;
  const isWinner = isHistorical && candidate.isWinner;
  const v = variant ?? (isHistorical ? "historical" : "current");

  return (
    <Card
      className={cn(
        "transition hover:shadow-glow",
        isWinner && "ring-1 ring-accent-violet/40",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
              style={{ background: party.color }}
            >
              {candidate.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-semibold tracking-tight">
                  {candidate.name}
                </span>
                {isWinner ? (
                  <Pill color={party.color}>
                    <Award className="w-3 h-3" />
                    당선
                  </Pill>
                ) : null}
              </div>
              <div className="text-xs text-ink-300 mt-0.5">
                {(candidate.partyNameRaw ??
                  historicalPartyNames[candidate.party]?.[
                    candidate.electionYear
                  ] ??
                  party.name)}
              </div>
            </div>
          </div>
          {v === "historical" && isHistorical ? (
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold tabular-nums text-ink-100">
                {formatPercent(candidate.voteShare)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-ink-400">
                득표율
              </div>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {candidate.career && candidate.career.length > 0 ? (
          <div className="flex items-start gap-2 text-xs text-ink-200">
            <User className="w-3.5 h-3.5 text-ink-300 mt-0.5 shrink-0" />
            <span className="leading-relaxed">
              {candidate.career.slice(0, 3).join(" · ")}
            </span>
          </div>
        ) : null}

        {isHistorical && candidate.termAssessment ? (
          <div className="grid grid-cols-2 gap-3">
            <ProgressBar
              label="공약이행률"
              value={
                candidate.termAssessment.pledgeFulfillmentRate ??
                candidate.termAssessment.overallScore / 100
              }
              color={party.color}
            />
            <ProgressBar
              label="종합평가"
              value={candidate.termAssessment.overallScore / 100}
              color="#22d3ee"
            />
          </div>
        ) : null}

        {!isHistorical && candidate.previousTerm?.termAssessment ? (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink-300 mb-2">
              <TrendingUp className="w-3 h-3" />
              직전 임기 ({candidate.previousTerm.year})
            </div>
            <ProgressBar
              label="공약이행률"
              value={candidate.previousTerm.pledgeFulfillmentRate ?? 0}
              color={party.color}
              size="sm"
            />
            <p className="mt-2 text-xs text-ink-300">
              {candidate.previousTerm.termAssessment.summary}
            </p>
          </div>
        ) : null}

        {isHistorical && candidate.termAssessment ? (
          <p className="text-xs text-ink-300 leading-relaxed">
            {candidate.termAssessment.summary}
          </p>
        ) : null}

        {!compact ? (
          <div>
            <div className="text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">
              핵심 공약
            </div>
            <PledgeList pledges={candidate.pledges} compact />
          </div>
        ) : null}

        {/* 논란·사건은 1차 자료가 없어 자체 표시하지 않습니다.
            시민이 직접 확인할 수 있도록 외부 검색 링크만 제공합니다. */}
        {!compact ? (
          <a
            href={`https://news.google.com/search?q=${encodeURIComponent(`"${candidate.name}" ${candidate.electionYear}`)}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 text-[11px] text-ink-400 hover:text-ink-200 underline-offset-2 hover:underline"
          >
            관련 뉴스 직접 검색 ↗
          </a>
        ) : null}
      </CardBody>
    </Card>
  );
}
