import { ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-app-border/10 bg-app-bg-soft p-5 shadow-panel">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-bold tracking-tight">{title}</h3>
          <button className="btn-secondary px-3" onClick={onClose} aria-label="Fechar">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
