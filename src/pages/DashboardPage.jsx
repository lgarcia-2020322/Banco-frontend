import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'

const DashboardPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="dashboard-box">
            <h1>Bienvenido al panel principal</h1>
            <p>Selecciona una opción del menú lateral para comenzar.</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage