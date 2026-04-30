import type { PropsWithChildren } from "react";

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid gap-4 lg:grid-cols-[250px_1fr]">
      <aside className="rounded-2xl border border-zinc-800 bg-panel/90 p-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Control Center</h2>
        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          <li className="rounded-lg bg-zinc-900/80 px-3 py-2">Manage events</li>
          <li className="rounded-lg px-3 py-2 text-zinc-400">Manage profile</li>
          <li className="rounded-lg px-3 py-2 text-zinc-400">Poster uploads</li>
        </ul>
      </aside>
      <main className="rounded-2xl border border-zinc-800 bg-panel/90 p-5 md:p-6">{children}</main>
    </div>
  );
}
