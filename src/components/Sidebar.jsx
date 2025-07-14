// Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const Sidebar = () => {
  const { user } = useAuth()

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img
          src="src/assets/logo_blanco_transparente-removebg-preview.png"
          alt="Logo Banco"
          className="logo"
        />
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard" className="nav-item">
          <img src="/src/assets/dashboard.png" alt="Dashboard" className="icon" />
          <span>Home</span>
        </NavLink>

        {user?.role === 'ADMIN' && (
          <>
            <NavLink to="/dashboard/users" className="nav-item">
              <img src="/src/assets/clients.png" alt="Clientes" className="icon" />
              <span>Users</span>
            </NavLink>

            <NavLink to="/dashboard/clients" className="nav-item">
              <img src="/src/assets/clients.png" alt="Clientes" className="icon" />
              <span>Clients</span>
            </NavLink>

            <NavLink to="/dashboard/products" className="nav-item">
              <img src="/src/assets/products.png" alt="Productos" className="icon" />
              <span>Products</span>
            </NavLink>
          </>
        )}

        {user?.role === 'CLIENT' && (
          <>
            <NavLink to="/dashboard/transfers" className="nav-item">
              <img src="/src/assets/transfers.png" alt="Transferencias" className="icon" />
              <span>Transfer</span>
            </NavLink>

            <NavLink to="/dashboard/deposits" className="nav-item">
              <img src="/src/assets/deposits.png" alt="Depósitos" className="icon" />
              <span>Deposit</span>
            </NavLink>

            <NavLink to="/dashboard/favorites" className="nav-item">
              <img src="/src/assets/favorites.png" alt="Favoritos" className="icon" />
              <span>Favorites</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  )
}
