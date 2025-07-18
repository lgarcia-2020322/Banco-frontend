import { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const DashboardPage = () => {
  useEffect(() => {
    // Agrega la clase cuando se monta
    document.body.classList.add('dashboard-theme')

    // La quita cuando se desmonta
    return () => {
      document.body.classList.remove('dashboard-theme')
    }
  }, [])

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
