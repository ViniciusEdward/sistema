import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { ClienteForm } from '../components/forms/ClienteForm';
import { EmptyState } from '../components/ui/EmptyState';
import { clientesService, ClienteInput } from '../services/clientesService';
import { Cliente, ClienteStatus } from '../types';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ClienteStatus | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);

  async function load() {
    setLoading(true);
    try {
      const result = await clientesService.list({ search, status, perPage: 50 });
      setClientes(result.data);
      setTotal(result.total);
    } catch {
      setClientes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  async function handleSubmit(input: ClienteInput) {
    try {
      if (editing) {
        await clientesService.update(editing.id, input);
        toast.success('Cliente atualizado.');
      } else {
        await clientesService.create(input);
        toast.success('Cliente cadastrado.');
      }
      setModalOpen(false);
      await load();
    } catch {
      // O toast padronizado já é exibido pelo interceptor da API.
    }
  }

  async function remove(cliente: Cliente) {
    if (!confirm(`Excluir ${cliente.nome}?`)) return;
    try {
      await clientesService.remove(cliente.id);
      toast.success('Cliente excluído.');
      await load();
    } catch {
      // O toast padronizado já é exibido pelo interceptor da API.
    }
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Cadastre, pesquise e filtre sua base. O dia fixo do cliente serve para sugerir novas mensalidades, sem alterar históricos."
        actions={<button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Novo cliente</button>}
      />

      <section className="mb-4 grid gap-3 rounded-2.5xl border border-app-border/10 bg-app-surface/60 p-4 backdrop-blur-glass md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
          <input className="input pl-11" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar por nome ou telefone" />
        </div>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value as ClienteStatus | '')}>
          <option value="">Todos os status</option>
          <option value="ATIVO">Ativos</option>
          <option value="INATIVO">Inativos</option>
          <option value="INADIMPLENTE">Inadimplentes</option>
        </select>
      </section>

      <div className="mb-3 text-sm text-app-muted">{loading ? 'Carregando...' : `${total} cliente(s) encontrado(s)`}</div>

      {clientes.length === 0 ? (
        <EmptyState title="Nenhum cliente encontrado" description="Cadastre seu primeiro cliente ou ajuste os filtros de busca." />
      ) : (
        <div className="table-shell overflow-x-auto">
          <table className="min-w-full divide-y divide-app-border/10 text-sm">
            <thead className="bg-app-surface-strong/50 text-left text-xs uppercase tracking-[0.16em] text-app-muted">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Dia</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/10">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="transition hover:bg-app-surface-strong/40">
                  <td className="px-4 py-4 font-semibold">{cliente.nome}</td>
                  <td className="px-4 py-4 text-app-muted">{cliente.telefone || '-'}</td>
                  <td className="px-4 py-4">{cliente.diaPagamento}</td>
                  <td className="px-4 py-4">{money.format(Number(cliente.valor))}</td>
                  <td className="px-4 py-4"><StatusBadge status={cliente.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="btn-secondary px-3" onClick={() => { setEditing(cliente); setModalOpen(true); }}><Pencil className="h-4 w-4" /></button>
                      <button className="btn-secondary px-3 text-neon-red" onClick={() => void remove(cliente)}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Editar cliente' : 'Novo cliente'} onClose={() => setModalOpen(false)}>
          <ClienteForm initial={editing} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
