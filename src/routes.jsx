//Routes
import { Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import  DashboardPage  from './pages/DashboardPage'
import { useAuth } from './contexts/AuthContext'
import { UsersPage } from './pages/UsersPage'


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
        element: <h2>Bienvenido al panel</h2>
      },
      {
        path: 'users',
        element: <AdminOnly><UsersPage /></AdminOnly>
      },
      {
        path: 'clients',
        element: <AdminOnly><h2>Gestión de Clientes</h2></AdminOnly>
      },
      {
        path: 'products',
        element: <AdminOnly><h2>Gestión de Productos</h2></AdminOnly>
      },
      {
        path: 'transfers',
        element: <ClientOnly><h2>Transferencias</h2></ClientOnly>
      },
      {
        path: 'deposits',
        element: <ClientOnly><h2>Depósitos</h2></ClientOnly>
      },
      {
        path: 'favorites',
        element: <ClientOnly><h2>Favoritos</h2></ClientOnly>
      }
    ]
  },
  {
    path: '*',
    element: <h1>Página no encontrada</h1>
  }
]

function RedirectBasedOnAuth() {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />
}

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" />
}

function AdminOnly({ children }) {
  const { user } = useAuth()
  return user?.role === 'ADMIN' ? children : <Navigate to="/dashboard" />
}

function ClientOnly({ children }) {
  const { user } = useAuth()
  return user?.role === 'CLIENT' ? children : <Navigate to="/dashboard" />
}
