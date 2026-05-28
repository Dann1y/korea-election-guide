import { cn } from "@/lib/cn";
import type { HTMLAttributes, PropsWithChildren } from "react";

export function Card({
  className,
  children,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        "glass rounded-2xl shadow-card overflow-hidden",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "px-4 py-3 md:px-5 md:py-4 border-b border-white/5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold tracking-tight text-ink-100 flex items-center gap-2",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardBody({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("p-4 md:p-5", className)}>{children}</div>;
}
