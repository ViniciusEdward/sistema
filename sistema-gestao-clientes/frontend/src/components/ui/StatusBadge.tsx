import { ClienteStatus, MensalidadeStatus } from '../../types';

export function StatusBadge({ status }: { status: ClienteStatus | MensalidadeStatus }) {
  const map: Record<string, string> = {
    ATIVO: 'bg-emerald-500/15 text-neon-green',
    INATIVO: 'bg-slate-500/15 text-app-muted',
    INADIMPLENTE: 'bg-rose-500/15 text-neon-red',
    PAGO: 'bg-emerald-500/15 text-neon-green',
    PENDENTE: 'bg-amber-500/15 text-neon-amber',
    ATRASADO: 'bg-rose-500/15 text-neon-red',
    CANCELADO: 'bg-slate-500/15 text-app-muted',
  };

  return <span className={`badge ${map[status]}`}>{status.replace('_', ' ')}</span>;
}
