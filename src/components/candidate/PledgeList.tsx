import {
  CheckCircle2,
  CircleDashed,
  Clock,
  HelpCircle,
  XCircle,
} from "lucide-react";
import type { Pledge } from "@/types";
import { cn } from "@/lib/cn";

const STATUS_META: Record<
  NonNullable<Pledge["status"]>,
  { label: string; color: string; Icon: typeof CheckCircle2 }
> = {
  completed: { label: "이행", color: "text-accent-lime", Icon: CheckCircle2 },
  in_progress: { label: "진행", color: "text-accent-cyan", Icon: Clock },
  partial: { label: "일부", color: "text-amber-400", Icon: CircleDashed },
  abandoned: { label: "미이행", color: "text-rose-400", Icon: XCircle },
  unknown: { label: "확인필요", color: "text-ink-300", Icon: HelpCircle },
};

interface Props {
  pledges: Pledge[];
  compact?: boolean;
}

export function PledgeList({ pledges, compact }: Props) {
  if (pledges.length === 0) {
    return (
      <p className="text-xs text-ink-300 italic">
        등록된 공약 데이터가 없습니다.
      </p>
    );
  }
  return (
    <ul className={cn("space-y-2", compact ? "" : "space-y-3")}>
      {pledges.map((p, i) => {
        const meta = p.status ? STATUS_META[p.status] : null;
        return (
          <li
            key={p.id ?? i}
            className="group flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-white/[0.03] transition"
          >
            <div className="text-[10px] tabular-nums text-ink-400 mt-0.5 w-5 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-ink-100">
                  {p.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-ink-300">
                  {p.category}
                </span>
                {meta ? (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-semibold",
                      meta.color,
                    )}
                  >
                    <meta.Icon className="w-3 h-3" />
                    {meta.label}
                  </span>
                ) : null}
              </div>
              {!compact ? (
                <p className="mt-1 text-xs text-ink-300 leading-relaxed">
                  {p.summary}
                </p>
              ) : null}
              {p.evidence && !compact ? (
                <p className="mt-1 text-[10px] text-ink-400 italic">
                  · {p.evidence}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
