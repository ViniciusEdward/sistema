import { FormEvent, useEffect, useState } from 'react';
import { Cliente, ClienteStatus } from '../../types';
import { ClienteInput } from '../../services/clientesService';

type Props = {
  initial?: Cliente | null;
  onSubmit: (input: ClienteInput) => Promise<void>;
  onCancel: () => void;
};

export function ClienteForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ClienteInput>({
    nome: '',
    telefone: '',
    diaPagamento: 10,
    valor: 0,
    status: 'ATIVO',
    observacoes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        nome: initial.nome,
        telefone: initial.telefone || '',
        diaPagamento: initial.diaPagamento,
        valor: Number(initial.valor),
        status: initial.status,
        observacoes: initial.observacoes || '',
      });
    }
  }, [initial]);

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
        <label className="label">Nome</label>
        <input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Telefone</label>
          <input className="input" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(71) 99999-9999" />
        </div>
        <div>
          <label className="label">Dia fixo</label>
          <input className="input" type="number" min={1} max={31} value={form.diaPagamento} onChange={(e) => setForm({ ...form, diaPagamento: Number(e.target.value) })} required />
        </div>
        <div>
          <label className="label">Valor</label>
          <input className="input" type="number" step="0.01" min={0} value={form.valor} onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })} required />
        </div>
      </div>
      <div>
        <label className="label">Status</label>
        <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ClienteStatus })}>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
          <option value="INADIMPLENTE">Inadimplente</option>
        </select>
      </div>
      <div>
        <label className="label">Observações</label>
        <textarea className="input min-h-24" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar cliente'}</button>
      </div>
    </form>
  );
}
