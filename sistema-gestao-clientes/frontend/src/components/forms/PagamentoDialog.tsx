import { FormEvent, useState } from 'react';
import { FormaPagamento, Mensalidade } from '../../types';

export function PagamentoDialog({ mensalidade, onCancel, onConfirm }: { mensalidade: Mensalidade; onCancel: () => void; onConfirm: (formaPagamento: FormaPagamento) => Promise<void> }) {
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('PIX');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await onConfirm(formaPagamento);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="rounded-2xl border border-app-border/10 bg-app-surface-strong/50 p-4">
        <p className="font-semibold">{mensalidade.cliente?.nome}</p>
        <p className="text-sm text-app-muted">Valor: {Number(mensalidade.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      </div>
      <div>
        <label className="label">Forma de pagamento</label>
        <select className="input" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}>
          <option value="PIX">PIX</option>
          <option value="DINHEIRO">Dinheiro</option>
          <option value="CARTAO_CREDITO">Cartão de crédito</option>
          <option value="CARTAO_DEBITO">Cartão de débito</option>
          <option value="BOLETO">Boleto</option>
          <option value="TRANSFERENCIA">Transferência</option>
          <option value="OUTRO">Outro</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" disabled={saving}>{saving ? 'Confirmando...' : 'Confirmar pagamento'}</button>
      </div>
    </form>
  );
}
