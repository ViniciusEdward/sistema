import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const mobileItems = [
  ['Dashboard', '/dashboard'],
  ['Clientes', '/clientes'],
  ['Mensalidades', '/mensalidades'],
  ['Pagamentos', '/pagamentos'],
];

export function Topbar() {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-app-border/10 bg-app-bg/75 px-4 py-3 backdrop-blur-glass sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <button className="btn-secondary px-3 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-card-gradient shadow-glow">
            <span className="font-display font-bold text-white">SG</span>
          </div>
          <span className="font-display font-bold">Gestão</span>
        </Link>

        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-app-muted">Sistema privado</p>
          <h1 className="font-display text-xl font-bold tracking-tight">Controle seus clientes e recebimentos</h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="btn-secondary px-3" onClick={toggleTheme} aria-label="Alternar tema">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="hidden rounded-2xl border border-app-border/10 bg-app-surface/60 px-3 py-2 text-right sm:block">
            <p className="text-sm font-bold">{user?.email}</p>
            <p className="text-xs text-app-muted">Operador único</p>
          </div>
          <button className="btn-secondary px-3" onClick={handleLogout} aria-label="Sair">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="mt-3 grid gap-2 rounded-2.5xl border border-app-border/10 bg-app-surface/80 p-2 backdrop-blur-glass lg:hidden">
          {mobileItems.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => clsx('rounded-2xl px-3 py-2 text-sm font-semibold text-app-muted', isActive && 'bg-electric-500/15 text-electric-400')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
