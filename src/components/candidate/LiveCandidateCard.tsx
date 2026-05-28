import { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Hash,
  Loader2,
  User,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { usePledges } from "@/hooks/useLiveCandidates";
import { getParty } from "@/data/parties";
import { cn } from "@/lib/cn";
import type { NECCandidate } from "@/lib/nec";
import type { PartyCode } from "@/types";

// NEC 정당명 → 내부 PartyCode 매핑 (색상용)
function mapParty(name: string | undefined): PartyCode {
  if (!name) return "etc";
  if (name.includes("더불어민주")) return "dp";
  if (name.includes("국민의힘")) return "ppp";
  if (name.includes("개혁")) return "rp";
  if (name.includes("정의")) return "jp";
  if (name.includes("진보")) return "npp";
  if (name.includes("녹색")) return "gjp";
  if (name.includes("여성")) return "wp";
  if (name.includes("자유통일")) return "ftu";
  if (name.includes("노동")) return "lp";
  if (name.includes("기본소득")) return "bip";
  if (name.includes("무소속")) return "ind";
  return "etc";
}

interface Props {
  sgId: string;
  sgTypecode: string;
  candidate: NECCandidate;
}

export function LiveCandidateCard({ sgId, sgTypecode, candidate }: Props) {
  const [open, setOpen] = useState(false);
  const partyCode = mapParty(candidate.party);
  const party = getParty(partyCode);
  const { loading, data, error } = usePledges(
    sgId,
    sgTypecode,
    open ? candidate.huboid : undefined,
  );

  return (
    <Card className="transition hover:shadow-glow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 md:gap-3">
          <div className="flex items-start gap-2.5 md:gap-3 min-w-0">
            <div
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 relative text-sm md:text-base"
              style={{ background: party.color }}
            >
              {candidate.name[0]}
              {candidate.giho ? (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-ink-900 border border-white/20 flex items-center justify-center text-[9px] md:text-[10px] font-bold tabular-nums">
                  {candidate.giho}
                </span>
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                <span className="text-base md:text-lg font-semibold tracking-tight">
                  {candidate.name}
                </span>
                {candidate.hanja ? (
                  <span className="text-[10px] md:text-xs text-ink-400 hidden sm:inline">
                    {candidate.hanja}
                  </span>
                ) : null}
                <Pill color={party.color}>{candidate.party ?? party.name}</Pill>
                {candidate.status && candidate.status !== "등록" ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-rose-400/30 bg-rose-400/10 text-rose-300">
                    {candidate.status}
                  </span>
                ) : null}
              </div>
              <div className="text-[11px] md:text-xs text-ink-300 mt-0.5 flex items-center gap-1.5 md:gap-2 flex-wrap">
                {candidate.age ? <span>만 {candidate.age}세</span> : null}
                {candidate.gender === "M"
                  ? "남"
                  : candidate.gender === "F"
                    ? "여"
                    : null}
                {candidate.job ? <span>· {candidate.job}</span> : null}
              </div>
            </div>
          </div>
          {candidate.giho ? (
            <div className="text-right shrink-0">
              <div className="text-lg md:text-xl font-bold tabular-nums text-ink-100 flex items-center gap-1">
                <Hash className="w-3 h-3 md:w-3.5 md:h-3.5 text-ink-400" />
                {candidate.giho}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-ink-400">
                기호
              </div>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        {candidate.education ? (
          <div className="text-xs text-ink-200 flex items-start gap-2">
            <span className="text-ink-400 mt-0.5 shrink-0 text-[10px] uppercase tracking-widest">
              학력
            </span>
            <span className="leading-relaxed">{candidate.education}</span>
          </div>
        ) : null}
        {candidate.careers.length > 0 ? (
          <div className="text-xs text-ink-200 flex items-start gap-2">
            <User className="w-3.5 h-3.5 text-ink-400 mt-0.5 shrink-0" />
            <span className="leading-relaxed">
              {candidate.careers.join(" · ")}
            </span>
          </div>
        ) : null}

        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "w-full flex items-center justify-between text-xs px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition",
          )}
        >
          <span className="font-medium text-ink-100">공약 보기</span>
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {open ? (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-ink-300 py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                공약 불러오는 중...
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 text-xs text-rose-300">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5" />
                {error}
              </div>
            ) : !data || data.pledges.length === 0 ? (
              <div className="text-xs text-ink-300">
                등록된 공약이 없습니다.
              </div>
            ) : (
              <ul className="space-y-2.5">
                {data.pledges.map((p) => (
                  <li key={p.order} className="flex items-start gap-3">
                    <div className="text-[10px] tabular-nums text-ink-400 mt-0.5 w-5 shrink-0">
                      {String(p.order).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-ink-100">
                          {p.title}
                        </span>
                        {p.realm ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-ink-300">
                            {p.realm}
                          </span>
                        ) : null}
                      </div>
                      {p.content ? (
                        <p className="mt-1 text-xs text-ink-300 leading-relaxed line-clamp-4">
                          {p.content}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
