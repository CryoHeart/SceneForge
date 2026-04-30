import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-gradient-to-r from-accent to-red-500 text-white shadow-glow hover:from-red-500 hover:to-red-400",
  secondary: "bg-gradient-to-r from-accentAlt to-purple-500 text-white shadow-purpleGlow hover:from-purple-500 hover:to-purple-400",
  ghost: "border border-zinc-700 bg-transparent text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900",
};

export function Button({ children, variant = "primary", className = "", ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
