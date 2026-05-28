import { cn } from "@/lib/cn";
import type { PropsWithChildren } from "react";

interface Props {
  color?: string; // hex
  className?: string;
  outline?: boolean;
}

export function Pill({
  color,
  className,
  outline,
  children,
}: PropsWithChildren<Props>) {
  const style = color
    ? outline
      ? {
          color,
          borderColor: `${color}55`,
          backgroundColor: `${color}14`,
        }
      : {
          color: "#fff",
          borderColor: `${color}88`,
          backgroundColor: `${color}33`,
        }
    : undefined;
  return (
    <span
      className={cn(
        "pill border-white/10 bg-white/5 text-ink-200",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
