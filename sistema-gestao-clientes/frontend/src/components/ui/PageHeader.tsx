import { ReactNode } from 'react';

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-electric-400">Painel v1.0</p>
        <h2 className="font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-app-muted">{subtitle}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
