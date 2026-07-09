import { Link, NavLink } from 'react-router-dom';
import { BarChart3, CreditCard, FileText, LayoutDashboard, ReceiptText, UsersRound, WalletCards } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, version: 'v1.0' },
  { to: '/clientes', label: 'Clientes', icon: UsersRound, version: 'v1.0' },
  { to: '/mensalidades', label: 'Mensalidades', icon: ReceiptText, version: 'v1.0' },
  { to: '/pagamentos', label: 'Pagamentos', icon: CreditCard, version: 'v1.0' },
  { to: '/caixa', label: 'Caixa', icon: WalletCards, version: 'v1.1' },
  { to: '/despesas', label: 'Despesas', icon: FileText, version: 'v1.1' },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3, version: 'v1.1' },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-app-border/10 bg-app-bg-soft/80 p-5 backdrop-blur-glass lg:block">
      <Link to="/dashboard" className="mb-8 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-card-gradient shadow-glow">
          <span className="font-display text-xl font-bold text-white">SG</span>
        </div>
        <div>
          <p className="font-display text-lg font-bold tracking-tight">Gestão Premium</p>
          <p className="text-xs text-app-muted">Painel financeiro v1.0</p>
        </div>
      </Link>

      <nav className="space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-app-muted transition duration-200 ease-out hover:bg-app-surface/60 hover:text-app-text',
                isActive && 'bg-app-surface/80 text-app-text shadow-glow-cyan',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={clsx('absolute left-0 h-7 w-1 rounded-r-full bg-transparent transition', isActive && 'bg-neon-cyan shadow-glow-cyan')} />
                <item.icon className={clsx('h-5 w-5 transition', isActive ? 'text-neon-cyan' : 'text-app-muted group-hover:text-electric-400')} />
                <span className="flex-1">{item.label}</span>
                {item.version !== 'v1.0' && <span className="rounded-full border border-app-border/10 px-2 py-0.5 text-[10px] text-app-muted">{item.version}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-5 left-5 right-5 rounded-2.5xl border border-electric-400/20 bg-card-gradient p-4 shadow-glow">
        <p className="font-display text-sm font-bold text-white">Roadmap ativo</p>
        <p className="mt-1 text-xs leading-5 text-slate-200">v1.0: login, dashboard, clientes, mensalidades e pagamentos.</p>
      </div>
    </aside>
  );
}
