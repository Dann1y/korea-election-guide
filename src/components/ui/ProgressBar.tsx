import { cn } from "@/lib/cn";

interface Props {
  value: number; // 0-1
  color?: string;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  color = "#8b5cf6",
  size = "md",
  label,
  className,
}: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="flex justify-between text-[11px] text-ink-300 mb-1">
          <span>{label}</span>
          <span className="tabular-nums">{pct.toFixed(0)}%</span>
        </div>
      ) : null}
      <div
        className={cn(
          "w-full rounded-full overflow-hidden bg-white/5",
          size === "sm" ? "h-1.5" : "h-2",
        )}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 12px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}
