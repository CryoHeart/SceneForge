import type { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function FormInput({ label, id, ...props }: FormInputProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2 text-sm text-white/75">
      <span className="font-medium">{label}</span>
      <input
        id={id}
        className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-white outline-none ring-0 placeholder:text-white/35 transition focus:border-rose-300/55 focus:bg-black/35"
        {...props}
      />
    </label>
  );
}
