import { Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { useAuth } from './contexts/AuthContext';
import { UsersPage } from './pages/UsersPage.jsx';
import { ClientsPage } from './pages/ClientsPage.jsx';
import { ClientProfilePage } from './pages/ClientProfilePage.jsx';
import { FavoritesPage } from './pages/FavoritesPage.jsx';
import { ProductsPage } from './pages/ProductsPage.jsx';
import PurchasesRouterPage from './pages/PurchasesRouterPage.jsx';
import MovementsPage from './pages/MovementsPage.jsx';
import { MovementProvider } from './contexts/MovementContext.jsx';
import DepositPage from './pages/DepositPage.jsx';
import { DepositMovementProvider } from './contexts/DepositMovementContext.jsx';
import TransferForm from './pages/TransfersPage.jsx';
import { TransferProvider } from './contexts/TransferContext.jsx';
// Importación corregida para el contexto de reportes (asumiendo el nombre que creamos)
import ReportsPage from './pages/reports-page.jsx'; // O el nombre que le hayas dado a tu página de reportes
import { ReportProvider } from './contexts/reports-context.jsx'; // ✅ Importado ReportProvider del archivo ReportContext.jsx

export const routes = [
  {
    path: '/',
    element: <RedirectBasedOnAuth />
  },
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        // Usar un componente dedicado para el contenido del index, o un simple div
        element: (
          <div style={{ padding: '20px', color: '#e0e0e0', fontSize: '2em', textAlign: 'center' }}>
            Bienvenido al panel
          </div>
        )
      },
      {
        path: 'profile',
        element: <ClientOnly><ClientProfilePage /></ClientOnly>
      },
      {
        path: 'users',
        element: <AdminOnly><UsersPage /></AdminOnly>
      },
      {
        path: 'clients',
        element: <AdminOnly><ClientsPage /></AdminOnly>
      },
      {
        path: 'products',
        element: <AdminOnly><ProductsPage /></AdminOnly>
      },
      {
        path: 'reports', // La ruta es correcta
        element: (
          <AdminOnly>
            {/* Usar el ReportProvider que creamos */}
            <ReportProvider>
              <ReportsPage />
            </ReportProvider>
          </AdminOnly>
        )
      },
      {
        path: 'transfers',
        element: (
          <ClientOnly>
            <TransferProvider>
              <TransferForm />
            </TransferProvider>
          </ClientOnly>
        )
      },
      {
        path: 'deposits',
        element: (
          <ClientOnly>
            <DepositMovementProvider>
              <DepositPage />
            </DepositMovementProvider>
          </ClientOnly>
        )
      },
      {
        path: 'favorites',
        element: <ClientOnly><FavoritesPage /></ClientOnly>
      },
      {
        path: 'purchases',
        element: <PurchasesRouterPage />
      },
      {
        path: 'movements',
        element: (
          <ClientOnly>
            <MovementProvider>
              <MovementsPage />
            </MovementProvider>
          </ClientOnly>
        )
      }
    ]
  },
  {
    path: '*',
    element: <h1>Página no encontrada</h1>
  }
];

// 🔐 Helpers para rutas privadas y por rol (sin cambios, están correctos)

function RedirectBasedOnAuth() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />;
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
}

function AdminOnly({ children }) {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? children : <Navigate to="/dashboard" />;
}

function ClientOnly({ children }) {
  const { user } = useAuth();
  return user?.role === 'CLIENT' ? children : <Navigate to="/dashboard" />;
}