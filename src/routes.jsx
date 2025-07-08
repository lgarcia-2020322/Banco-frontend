//Routes
import { Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import  DashboardPage  from './pages/DashboardPage'
import { useAuth } from './contexts/AuthContext'

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
      // Aquí puedes ir agregando tus vistas hijas, como productos, transferencias, etc.
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

