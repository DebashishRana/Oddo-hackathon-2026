import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-[var(--af-accent)] text-white shadow-[0_12px_28px_rgba(15,118,110,0.28)] hover:bg-[var(--af-accent-strong)]",
  secondary:
    "border border-[var(--af-border)] bg-white text-[var(--af-ink)] hover:bg-slate-50",
  ghost: "text-[var(--af-muted)] hover:bg-white/70 hover:text-[var(--af-ink)]",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
