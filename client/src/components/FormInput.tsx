import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({ label, className = "", ...props }: FormInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</span>
      <input
        className={`w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-3 py-2.5 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-accent focus:ring-1 focus:ring-accent/60 ${className}`}
        {...props}
      />
    </label>
  );
}
