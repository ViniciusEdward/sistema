import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, senha);
      const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-premium-radial px-4 py-10 text-app-text">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-app-border/10 bg-app-surface/60 shadow-panel backdrop-blur-glass lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-card-gradient p-10 text-white lg:block">
          <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-electric-400/25 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-neon-cyan/20 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-8 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 shadow-glow backdrop-blur-glass">
                <span className="font-display text-2xl font-bold">SG</span>
              </div>
              <h1 className="font-display text-5xl font-bold leading-tight tracking-[-0.06em]">Gestão de clientes com visual de cockpit.</h1>
              <p className="mt-6 max-w-md text-sm leading-6 text-slate-100">Dashboard premium, mensalidades históricas e pagamentos conectados automaticamente ao caixa.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Receita', 'Clientes', 'Cobranças'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-glass">
                  <p className="text-xs text-slate-200">{item}</p>
                  <p className="mt-2 font-display text-xl font-bold">v1.0</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric-400">Acesso privado</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em]">Entrar no sistema</h2>
            <p className="mt-2 text-sm text-app-muted">Login único. Não existe cadastro público.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="label">E-mail</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
                <input className="input pl-11" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@sistema.local" autoComplete="email" required />
              </div>
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
                <input className="input pl-11" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" autoComplete="current-password" required />
              </div>
            </div>
            <button className="btn-primary mt-2 h-12" disabled={loading}>{loading ? 'Entrando...' : 'Acessar painel'}</button>
          </form>

          <div className="mt-6 rounded-2xl border border-app-border/10 bg-app-surface-strong/50 p-4 text-xs leading-5 text-app-muted">
            Segurança: o JWT fica em cookie httpOnly, mais seguro contra XSS que localStorage. No deploy em domínios diferentes, o cookie usa SameSite=None + Secure.
          </div>
        </div>
      </section>
    </main>
  );
}
