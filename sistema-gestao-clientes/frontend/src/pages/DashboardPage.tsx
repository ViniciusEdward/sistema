import { AlertTriangle, Banknote, CalendarClock, TrendingUp, UserCheck, UserX } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { Loader } from '../components/ui/Loader';
import { EmptyState } from '../components/ui/EmptyState';
import { dashboardService } from '../services/dashboardService';
import { useAsync } from '../hooks/useAsync';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function DashboardPage() {
  const { data, loading } = useAsync(() => dashboardService.get(), []);

  if (loading || !data) return <Loader />;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Resumo financeiro do mês, saúde dos clientes e próximas cobranças." />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KpiCard title="Receita do mês" value={money.format(data.receitaMes)} hint="Pagamentos confirmados" icon={Banknote} tone="green" />
        <KpiCard title="Lucro do mês" value={money.format(data.lucro)} hint="Receita menos despesas" icon={TrendingUp} tone="cyan" />
        <KpiCard title="Clientes ativos" value={data.clientesAtivos} hint="Base ativa atual" icon={UserCheck} tone="blue" />
        <KpiCard title="Inadimplentes" value={data.clientesInadimplentes} hint="Clientes marcados manualmente" icon={UserX} tone="red" />
        <KpiCard title="Cobranças hoje" value={data.cobrancasHoje} hint="Mensalidades vencendo hoje" icon={CalendarClock} tone="amber" />
        <KpiCard title="Atrasadas" value={data.cobrancasAtrasadas} hint="Pendentes com vencimento passado" icon={AlertTriangle} tone="red" />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <div className="premium-card min-h-[360px]">
          <div className="relative mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-bold">Evolução mensal</h3>
              <p className="text-sm text-app-muted">Receita, despesas e lucro dos últimos 6 meses.</p>
            </div>
          </div>
          <div className="relative h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.graficoMensal}>
                <defs>
                  <linearGradient id="receita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="lucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,.16)" />
                <XAxis dataKey="mes" stroke="rgb(var(--color-muted))" fontSize={12} />
                <YAxis stroke="rgb(var(--color-muted))" fontSize={12} tickFormatter={(value) => `R$${value}`} />
                <Tooltip contentStyle={{ background: 'rgb(var(--color-surface-strong))', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16 }} formatter={(value) => money.format(Number(value))} />
                <Area type="monotone" dataKey="receita" stroke="#60A5FA" fill="url(#receita)" strokeWidth={3} />
                <Area type="monotone" dataKey="lucro" stroke="#22D3EE" fill="url(#lucro)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-card">
          <h3 className="relative font-display text-xl font-bold">Últimos pagamentos</h3>
          <div className="relative mt-4 space-y-3">
            {data.ultimosPagamentos.length === 0 ? (
              <EmptyState title="Nada por aqui" description="Os pagamentos confirmados aparecerão neste painel." />
            ) : (
              data.ultimosPagamentos.map((pagamento) => (
                <div key={pagamento.id} className="rounded-2xl border border-app-border/10 bg-app-surface-strong/40 p-4">
                  <p className="font-semibold">{pagamento.cliente.nome}</p>
                  <div className="mt-2 flex items-center justify-between gap-3 text-sm text-app-muted">
                    <span>{new Date(pagamento.pagoEm).toLocaleDateString('pt-BR')}</span>
                    <strong className="text-neon-green">{money.format(Number(pagamento.valor))}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
