import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={cn("af-panel p-5 sm:p-6", className)}>{children}</section>;
}

export function CardHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--af-muted)]">{eyebrow}</p>
        ) : null}
        <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--af-ink)] sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
