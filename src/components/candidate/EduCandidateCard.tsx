import { Award, GraduationCap, User } from "lucide-react";
import type { EducationCandidate } from "@/types";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { PledgeList } from "./PledgeList";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/cn";

const IDEOLOGY_META = {
  progressive: { label: "진보", color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  conservative: { label: "보수", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  centrist: { label: "중도", color: "#a3a3a3", bg: "rgba(163,163,163,0.12)" },
} as const;

interface Props {
  candidate: EducationCandidate;
  compact?: boolean;
}

export function EduCandidateCard({ candidate, compact }: Props) {
  const meta = IDEOLOGY_META[candidate.ideology];
  return (
    <Card className="transition hover:shadow-glow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
              style={{ background: meta.color }}
            >
              {candidate.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-semibold tracking-tight">
                  {candidate.name}
                </span>
                <Pill
                  className={cn("border")}
                  outline
                  color={meta.color}
                >
                  <GraduationCap className="w-3 h-3" />
                  {meta.label} 진영
                </Pill>
                {candidate.registrationStatus === "primary" ? (
                  <span className="text-[10px] text-amber-300 border border-amber-400/30 bg-amber-400/10 rounded px-1.5 py-0.5">
                    경선 진행
                  </span>
                ) : null}
              </div>
              <div className="text-xs text-ink-300 mt-0.5">
                정당 공천 없음 (교육감 선거)
              </div>
            </div>
          </div>
          {candidate.pollingShare !== undefined ? (
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold tabular-nums text-ink-100">
                {formatPercent(candidate.pollingShare)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-ink-400">
                여론조사
              </div>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        {candidate.career && candidate.career.length > 0 ? (
          <div className="flex items-start gap-2 text-xs text-ink-200">
            <User className="w-3.5 h-3.5 text-ink-300 mt-0.5 shrink-0" />
            <span className="leading-relaxed">
              {candidate.career.slice(0, 3).join(" · ")}
            </span>
          </div>
        ) : null}
        {!compact && candidate.pledges.length > 0 ? (
          <div>
            <div className="text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">
              주요 공약
            </div>
            <PledgeList pledges={candidate.pledges} compact />
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
