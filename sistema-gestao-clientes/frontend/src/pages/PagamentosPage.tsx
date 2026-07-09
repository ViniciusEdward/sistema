import { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { pagamentosService } from '../services/pagamentosService';
import { Pagamento } from '../types';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await pagamentosService.list({ perPage: 50 });
        if (!active) return;
        setPagamentos(result.data);
        setTotal(result.total);
      } catch {
        if (!active) return;
        setPagamentos([]);
        setTotal(0);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <PageHeader title="Pagamentos" subtitle="Histórico de mensalidades marcadas como pagas. Cada pagamento cria automaticamente uma entrada no caixa." />

      <div className="mb-3 text-sm text-app-muted">{loading ? 'Carregando...' : `${total} pagamento(s) registrado(s)`}</div>

      {pagamentos.length === 0 ? (
        <EmptyState title="Nenhum pagamento registrado" description="Marque uma mensalidade como paga para alimentar este histórico." />
      ) : (
        <div className="grid gap-3">
          {pagamentos.map((pagamento) => (
            <article key={pagamento.id} className="premium-card">
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-electric-500/15 p-3 text-electric-400">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">{pagamento.cliente.nome}</h3>
                    <p className="text-sm text-app-muted">Pago em {new Date(pagamento.pagoEm).toLocaleString('pt-BR')} · {pagamento.formaPagamento.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-display text-2xl font-bold tracking-[-0.04em] text-neon-green">{money.format(Number(pagamento.valor))}</p>
                  <div className="mt-1"><StatusBadge status="PAGO" /></div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
