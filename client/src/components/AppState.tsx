interface AppStateProps {
  title: string;
  message: string;
  tone?: "default" | "error";
}

export function AppState({ title, message, tone = "default" }: AppStateProps) {
  const borderClass = tone === "error" ? "border-red-500/50" : "border-zinc-800";
  const titleClass = tone === "error" ? "text-red-300" : "text-zinc-100";

  return (
    <div className={`rounded-2xl border bg-panel/80 px-6 py-10 text-center ${borderClass}`}>
      <h3 className={`text-lg font-bold ${titleClass}`}>{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{message}</p>
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-72 animate-pulse rounded-2xl border border-zinc-800 bg-panelSoft" />
      ))}
    </div>
  );
}
