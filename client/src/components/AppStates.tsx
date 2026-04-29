import { Button } from "./Button";
import { SurfaceCard } from "./SurfaceCard";

type StateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

function StateShell({ title, description, actionLabel, onAction }: StateProps) {
  return (
    <SurfaceCard className="p-8 text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-white/65">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </SurfaceCard>
  );
}

export function LoadingState({ title = "Loading scene data..." }: { title?: string }) {
  return (
    <SurfaceCard className="p-8">
      <div className="flex items-center justify-center gap-3 text-white/75">
        <span className="h-3 w-3 animate-pulse rounded-full bg-rose-300/80" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-rose-300/50 [animation-delay:150ms]" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-rose-300/30 [animation-delay:300ms]" />
      </div>
      <p className="mt-4 text-center text-sm text-white/70">{title}</p>
    </SurfaceCard>
  );
}

export function EmptyState(props: StateProps) {
  return <StateShell {...props} />;
}

export function ErrorState(props: StateProps) {
  return <StateShell {...props} />;
}
