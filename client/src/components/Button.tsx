import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import clsx from "clsx";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60",
        variant === "primary" &&
          "bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-500 hover:to-rose-400 shadow-[0_8px_24px_rgba(225,29,72,0.35)]",
        variant === "secondary" && "bg-scene-700/90 text-white hover:bg-scene-700",
        variant === "ghost" && "border border-white/15 bg-transparent text-white hover:border-rose-300/35 hover:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
