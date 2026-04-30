import type { PropsWithChildren } from "react";

export function Badge({ children }: PropsWithChildren) {
  return (
    <span className="rounded-full border border-zinc-700/90 bg-zinc-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-300">
      {children}
    </span>
  );
}
