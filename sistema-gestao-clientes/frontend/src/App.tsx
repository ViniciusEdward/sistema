import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientesPage } from './pages/ClientesPage';
import { MensalidadesPage } from './pages/MensalidadesPage';
import { PagamentosPage } from './pages/PagamentosPage';
import { ComingSoonPage } from './pages/ComingSoonPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="mensalidades" element={<MensalidadesPage />} />
        <Route path="pagamentos" element={<PagamentosPage />} />
        <Route path="caixa" element={<ComingSoonPage title="Caixa" version="v1.1" />} />
        <Route path="despesas" element={<ComingSoonPage title="Despesas" version="v1.1" />} />
        <Route path="relatorios" element={<ComingSoonPage title="Relatórios" version="v1.1" />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
