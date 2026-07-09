import { Rocket } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';

export function ComingSoonPage({ title, version }: { title: string; version: string }) {
  return (
    <div>
      <PageHeader title={title} subtitle={`Este módulo entra na ${version}, depois da validação da v1.0.`} />
      <div className="premium-card grid min-h-72 place-items-center text-center">
        <div className="relative">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-card-gradient text-white shadow-glow">
            <Rocket className="h-7 w-7" />
          </div>
          <h3 className="font-display text-2xl font-bold">Roadmap protegido</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-app-muted">A estrutura de banco já está preparada para este módulo, mas a interface e endpoints completos serão implementados na próxima etapa.</p>
        </div>
      </div>
    </div>
  );
}
