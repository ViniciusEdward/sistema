import clsx from 'clsx';

export function Loader({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div className={clsx('grid place-items-center', fullScreen ? 'min-h-screen' : 'min-h-48')}>
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-app-border/10 border-t-electric-400 shadow-glow" />
    </div>
  );
}
