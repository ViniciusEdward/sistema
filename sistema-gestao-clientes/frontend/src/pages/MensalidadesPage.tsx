import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { MensalidadeForm } from '../components/forms/MensalidadeForm';
import { PagamentoDialog } from '../components/forms/PagamentoDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { clientesService } from '../services/clientesService';
import { mensalidadesService, MensalidadeInput } from '../services/mensalidadesService';
import { Cliente, FormaPagamento, Mensalidade, MensalidadeStatus } from '../types';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function MensalidadesPage() {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<MensalidadeStatus | ''>('');
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Mensalidade | null>(null);
  const [paying, setPaying] = useState<Mensalidade | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [mensalidadesResult, clientesResult] = await Promise.all([
        mensalidadesService.list({ search, status, perPage: 50 }),
        clientesService.list({ perPage: 100, status: 'ATIVO' }),
      ]);
      setMensalidades(mensalidadesResult.data);
      setTotal(mensalidadesResult.total);
      setClientes(clientesResult.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = window.setTimeout(load, 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  async function handleSubmit(input: MensalidadeInput) {
    if (editing) {
      await mensalidadesService.update(editing.id, input);
      toast.success('Mensalidade atualizada.');
    } else {
      await mensalidadesService.create(input);
      toast.success('Mensalidade criada.');
    }
    setFormOpen(false);
    await load();
  }

  async function remove(mensalidade: Mensalidade) {
    if (!confirm('Excluir esta mensalidade?')) return;
    await mensalidadesService.remove(mensalidade.id);
    toast.success('Mensalidade excluída.');
    await load();
  }

  async function confirmPayment(formaPagamento: FormaPagamento) {
    if (!paying) return;
    await mensalidadesService.pagar(paying.id, { formaPagamento });
    toast.success('Pagamento confirmado e lançado no caixa.');
    setPaying(null);
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Mensalidades"
        subtitle="Cada renovação vira um novo registro. Alterar um vencimento específico nunca muda o dia fixo cadastrado no cliente."
        actions={<button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Nova mensalidade</button>}
      />

      <section className="mb-4 grid gap-3 rounded-2.5xl border border-app-border/10 bg-app-surface/60 p-4 backdrop-blur-glass md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          <input className="input pl-11" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar por cliente" />
        </div>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value as MensalidadeStatus | '')}>
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="PAGO">Pagas</option>
          <option value="ATRASADO">Atrasadas</option>
          <option value="CANCELADO">Canceladas</option>
        </select>
      </section>

      <div className="mb-3 text-sm text-app-muted">{loading ? 'Carregando...' : `${total} mensalidade(s) encontrada(s)`}</div>

      {mensalidades.length === 0 ? (
        <EmptyState title="Nenhuma mensalidade encontrada" description="Gere uma mensalidade para começar o histórico financeiro." />
      ) : (
        <div className="table-shell overflow-x-auto">
          <table className="min-w-full divide-y divide-app-border/10 text-sm">
            <thead className="bg-app-surface-strong/50 text-left text-xs uppercase tracking-[0.16em] text-app-muted">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Competência</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/10">
              {mensalidades.map((mensalidade) => (
                <tr key={mensalidade.id} className="transition hover:bg-app-surface-strong/40">
                  <td className="px-4 py-4 font-semibold">{mensalidade.cliente?.nome}</td>
                  <td className="px-4 py-4 text-app-muted">{new Date(mensalidade.competencia).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-4">{new Date(mensalidade.vencimento).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-4">{money.format(Number(mensalidade.valor))}</td>
                  <td className="px-4 py-4"><StatusBadge status={mensalidade.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      {mensalidade.status !== 'PAGO' && (
                        <button className="btn-secondary px-3 text-neon-green" onClick={() => setPaying(mensalidade)} title="Marcar como pago"><CheckCircle2 className="h-4 w-4" /></button>
                      )}
                      {mensalidade.status !== 'PAGO' && (
                        <button className="btn-secondary px-3" onClick={() => { setEditing(mensalidade); setFormOpen(true); }}><Pencil className="h-4 w-4" /></button>
                      )}
                      {mensalidade.status !== 'PAGO' && (
                        <button className="btn-secondary px-3 text-neon-red" onClick={() => remove(mensalidade)}><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <Modal title={editing ? 'Editar mensalidade' : 'Nova mensalidade'} onClose={() => setFormOpen(false)}>
          <MensalidadeForm clientes={clientes} initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
        </Modal>
      )}

      {paying && (
        <Modal title="Confirmar pagamento" onClose={() => setPaying(null)}>
          <PagamentoDialog mensalidade={paying} onCancel={() => setPaying(null)} onConfirm={confirmPayment} />
        </Modal>
      )}
    </div>
  );
}
