import type { PropsWithChildren } from "react";

export function Badge({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex items-center rounded-full border border-rose-200/20 bg-rose-500/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-rose-100">
      {children}
    </span>
  );
}
