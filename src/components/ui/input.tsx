import { cn } from "@/lib/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-[var(--af-border)] bg-white px-4 py-3 text-sm text-[var(--af-ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--af-accent)] focus:ring-4 focus:ring-[var(--af-accent-soft)]",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-[var(--af-border)] bg-white px-4 py-3 text-sm text-[var(--af-ink)] outline-none transition focus:border-[var(--af-accent)] focus:ring-4 focus:ring-[var(--af-accent-soft)]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-[var(--af-border)] bg-white px-4 py-3 text-sm text-[var(--af-ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--af-accent)] focus:ring-4 focus:ring-[var(--af-accent-soft)]",
        className
      )}
      {...props}
    />
  );
}

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("mb-2 block text-sm font-medium text-slate-700", className)}>{children}</span>;
}
