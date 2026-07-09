import { LucideIcon } from 'lucide-react';

export function KpiCard({ title, value, hint, icon: Icon, tone = 'blue' }: { title: string; value: string | number; hint?: string; icon: LucideIcon; tone?: 'blue' | 'cyan' | 'green' | 'red' | 'amber' }) {
  const toneClass = {
    blue: 'text-electric-400 bg-electric-500/15',
    cyan: 'text-neon-cyan bg-cyan-500/15',
    green: 'text-neon-green bg-emerald-500/15',
    red: 'text-neon-red bg-rose-500/15',
    amber: 'text-neon-amber bg-amber-500/15',
  }[tone];

  return (
    <div className="premium-card">
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-app-muted">{title}</p>
          <p className="mt-3 font-display text-3xl font-bold tracking-[-0.05em] sm:text-4xl">{value}</p>
          {hint && <p className="mt-2 text-xs text-app-muted">{hint}</p>}
        </div>
        <div className={`rounded-2xl p-3 ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
