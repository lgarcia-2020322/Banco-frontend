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
          <div className="icon-wrapper">
            <img src="src/assets/casa.png" alt="Home static" className="icon static" />
            <img src="/src/assets/output-onlinegiftools.gif" alt="Home gif" className="icon gif" />
          </div>
          <span>Home</span>
        </NavLink>

        {user?.role === 'ADMIN' && (
          <>
            <NavLink to="/dashboard/users" className="nav-item">
              <div className="icon-wrapper">
                <img src="/src/assets/perfil.png" alt="Users static" className="icon static" />
                <img src="/src/assets/output-onlinegiftools (1).gif" alt="Users gif" className="icon gif" />
              </div>
              <span>Users</span>
            </NavLink>

            <NavLink to="/dashboard/clients" className="nav-item">
              <div className="icon-wrapper">
                <img src="/src/assets/cliente.png" alt="Clients static" className="icon static" />
                <img src="/src/assets/output-onlinegiftools (6).gif" alt="Clients gif" className="icon gif" />
              </div>
              <span>Clients</span>
            </NavLink>

            <NavLink to="/dashboard/products" className="nav-item">
              <div className="icon-wrapper">
                <img src="/src/assets/paleta.png" alt="Products static" className="icon static" />
                <img src="/src/assets/output-onlinegiftools (7).gif" alt="Products gif" className="icon gif" />
              </div>
              <span>Products</span>
            </NavLink>
          </>
        )}

        {user?.role === 'CLIENT' && (
          <>
            <NavLink to="/dashboard/profile" className="nav-item">
              <div className="icon-wrapper">
                <img src="/src/assets/perfil.png" alt="Perfil static" className="icon static" />
                <img src="/src/assets/output-onlinegiftools (1).gif" alt="Perfil gif" className="icon gif" />
              </div>
              <span>Mi Perfil</span>
            </NavLink>

            <NavLink to="/dashboard/transfers" className="nav-item">
              <div className="icon-wrapper">
                <img src="/src/assets/metodo-de-pago.png" alt="Transfer static" className="icon static" />
                <img src="/src/assets/output-onlinegiftools (2).gif" alt="Transfer gif" className="icon gif" />
              </div>
              <span>Transfer</span>
            </NavLink>

            <NavLink to="/dashboard/deposits" className="nav-item">
              <div className="icon-wrapper">
                <img src="/src/assets/depositar.png" alt="Deposit static" className="icon static" />
                <img src="/src/assets/output-onlinegiftools (4).gif" alt="Deposit gif" className="icon gif" />
              </div>
              <span>Deposit</span>
            </NavLink>

            <NavLink to="/dashboard/favorites" className="nav-item">
              <div className="icon-wrapper">
                <img src="/src/assets/marcador.png" alt="Favorites static" className="icon static" />
                <img src="/src/assets/output-onlinegiftools (5).gif" alt="Favorites gif" className="icon gif" />
              </div>
              <span>Favorites</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  )
}
