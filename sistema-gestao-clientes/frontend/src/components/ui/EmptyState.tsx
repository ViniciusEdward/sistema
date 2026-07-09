export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid min-h-52 place-items-center rounded-2.5xl border border-dashed border-app-border/20 bg-app-surface/30 p-8 text-center">
      <div>
        <p className="font-display text-xl font-bold">{title}</p>
        <p className="mt-2 text-sm text-app-muted">{description}</p>
      </div>
    </div>
  );
}
