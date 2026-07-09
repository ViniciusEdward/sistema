import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Cliente, Mensalidade } from '../../types';
import { MensalidadeInput } from '../../services/mensalidadesService';

type Props = {
  clientes: Cliente[];
  initial?: Mensalidade | null;
  onSubmit: (input: MensalidadeInput) => Promise<void>;
  onCancel: () => void;
};

function monthStartISO(date = new Date()) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1)).toISOString().slice(0, 10);
}

function dueDateForClient(cliente?: Cliente) {
  const now = new Date();
  const day = cliente?.diaPagamento || 10;
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), Math.min(day, 28))).toISOString().slice(0, 10);
}

export function MensalidadeForm({ clientes, initial, onSubmit, onCancel }: Props) {
  const firstClient = clientes[0];
  const [form, setForm] = useState<MensalidadeInput>({
    clienteId: firstClient?.id || 0,
    competencia: monthStartISO(),
    vencimento: dueDateForClient(firstClient),
    valor: Number(firstClient?.valor || 0),
    status: 'PENDENTE',
    observacoes: '',
  });
  const [saving, setSaving] = useState(false);

  const selectedCliente = useMemo(() => clientes.find((cliente) => cliente.id === form.clienteId), [clientes, form.clienteId]);

  useEffect(() => {
    if (initial) {
      setForm({
        clienteId: initial.clienteId,
        competencia: initial.competencia.slice(0, 10),
        vencimento: initial.vencimento.slice(0, 10),
        valor: Number(initial.valor),
        status: initial.status === 'PAGO' ? 'PENDENTE' : initial.status,
        observacoes: initial.observacoes || '',
      });
      return;
    }

    if (firstClient) {
      setForm((current) => ({ ...current, clienteId: firstClient.id, vencimento: dueDateForClient(firstClient), valor: Number(firstClient.valor) }));
    }
  }, [initial, firstClient]);

  function handleClienteChange(clienteId: number) {
    const cliente = clientes.find((item) => item.id === clienteId);
    setForm((current) => ({
      ...current,
      clienteId,
      vencimento: dueDateForClient(cliente),
      valor: Number(cliente?.valor || current.valor),
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label className="label">Cliente</label>
        <select className="input" value={form.clienteId} onChange={(e) => handleClienteChange(Number(e.target.value))} disabled={Boolean(initial)} required>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
          ))}
        </select>
        {selectedCliente && <p className="mt-2 text-xs text-app-muted">Dia fixo do cliente: {selectedCliente.diaPagamento}. Alterar este vencimento não muda o cadastro do cliente.</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Competência</label>
          <input className="input" type="date" value={form.competencia} onChange={(e) => setForm({ ...form, competencia: e.target.value })} required />
        </div>
        <div>
          <label className="label">Vencimento</label>
          <input className="input" type="date" value={form.vencimento} onChange={(e) => setForm({ ...form, vencimento: e.target.value })} required />
        </div>
        <div>
          <label className="label">Valor</label>
          <input className="input" type="number" min={0} step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })} required />
        </div>
      </div>
      <div>
        <label className="label">Status</label>
        <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as MensalidadeInput['status'] })}>
          <option value="PENDENTE">Pendente</option>
          <option value="ATRASADO">Atrasado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>
      <div>
        <label className="label">Observações</label>
        <textarea className="input min-h-24" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" disabled={saving || clientes.length === 0}>{saving ? 'Salvando...' : 'Salvar mensalidade'}</button>
      </div>
    </form>
  );
}
