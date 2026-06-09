import { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
      <div>
        <h1 className="font-display text-3xl text-navy-deep">{title}</h1>
        {description && <p className="text-sm text-charcoal/60 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/60 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-charcoal/50 mt-1">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white focus:outline-none focus:border-gold ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-md border border-black/10 text-sm bg-white focus:outline-none focus:border-gold ${props.className ?? ""}`}
    />
  );
}

export function Button({
  variant = "primary", className = "", ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "outline" }) {
  const styles = {
    primary: "bg-navy-deep text-white hover:bg-navy",
    ghost: "text-charcoal/70 hover:text-navy-deep",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-black/15 text-navy-deep hover:bg-light",
  }[variant];
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-[0.14em] transition-colors disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white border border-black/5 rounded-lg p-5 ${className}`}>{children}</div>;
}
