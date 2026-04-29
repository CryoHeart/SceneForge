import type { HTMLAttributes, PropsWithChildren } from "react";
import clsx from "clsx";

type SurfaceCardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  interactive?: boolean;
};

export function SurfaceCard({ children, className, interactive = false, ...props }: SurfaceCardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 bg-scene-800/80 shadow-panel backdrop-blur-sm",
        interactive && "transition hover:-translate-y-0.5 hover:border-rose-300/25 hover:shadow-[0_0_0_1px_rgba(225,29,72,0.15),0_20px_35px_rgba(0,0,0,0.35)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
