import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  className?: string;
}

export function Stat({ label, value, hint, className }: Props) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-4 flex flex-col gap-1 min-w-0",
        className,
      )}
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300">
        {label}
      </div>
      <div className="text-2xl font-semibold text-ink-100 tabular-nums">
        {value}
      </div>
      {hint ? (
        <div className="text-xs text-ink-300 truncate">{hint}</div>
      ) : null}
    </div>
  );
}
