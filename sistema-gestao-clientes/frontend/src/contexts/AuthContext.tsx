import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { clearAccessToken } from '../services/tokenStorage';
import { Usuario } from '../types';

type AuthContextValue = {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const timeout = window.setTimeout(() => {
      if (active) {
        setUser(null);
        setLoading(false);
      }
    }, 8000);

    async function loadSession() {
      try {
        const usuario = await authService.me();
        if (active) setUser(usuario);
      } catch {
        if (active) setUser(null);
      } finally {
        window.clearTimeout(timeout);
        if (active) setLoading(false);
      }
    }

    function handleUnauthorized() {
      clearAccessToken();
      setUser(null);
      setLoading(false);
    }

    window.addEventListener('sgc:unauthorized', handleUnauthorized);
    void loadSession();

    return () => {
      active = false;
      window.clearTimeout(timeout);
      window.removeEventListener('sgc:unauthorized', handleUnauthorized);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, senha) {
        const usuario = await authService.login(email, senha);
        setUser(usuario);
        toast.success('Login realizado com sucesso.');
      },
      async logout() {
        try {
          await authService.logout();
        } finally {
          clearAccessToken();
          setUser(null);
        }
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa estar dentro do AuthProvider.');
  }

  return context;
}
