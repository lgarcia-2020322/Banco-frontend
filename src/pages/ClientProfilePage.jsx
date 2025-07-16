import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getClientProfile } from '../services/client.api'
import { toast } from 'react-toastify'

export const ClientProfilePage = () => {
  const { user } = useAuth()
  if (user?.role !== 'CLIENT') return <Navigate to="/dashboard" />

  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    setLoading(true)
    const res = await getClientProfile()
    if (res?.success) {
      setClient(res.client)
    } else {
      toast.error(res?.message || 'No se pudo cargar el perfil')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) return <p style={{ color: '#fff' }}>Cargando perfil...</p>
  if (!client) return <p style={{ color: '#fff' }}>No se pudo cargar el perfil del cliente.</p>

  return (
    <div className="profile-container profile-fx">
      <div className="profile-card">
        <img src={client.avatar || '/'} alt="Avatar" className="profile-avatar" />
        <h2>Mi Perfil</h2>
        <p className="profile-field"><strong>Nombre:</strong> {client.user.name} {client.user.surname}</p>
        <p className="profile-field"><strong>Username:</strong> {client.user.username}</p>
        <p className="profile-field"><strong>Email:</strong> {client.user.email}</p>
        <p className="profile-field"><strong>DPI:</strong> {client.dpi}</p>
        <p className="profile-field"><strong>Teléfono:</strong> {client.phone}</p>
        <p className="profile-field"><strong>Dirección:</strong> {client.address}</p>
        <p className="profile-field"><strong>Trabajo:</strong> {client.job}</p>
        <p className="profile-field"><strong>Ingreso mensual:</strong> Q{client.monthlyIncome}</p>
        <p className="profile-field"><strong>Moneda:</strong> {client.currency}</p>
        <p className="profile-field"><strong>No. Cuenta:</strong> {client.accountNumber}</p>
        <p className="profile-field"><strong>Saldo:</strong> {client.balance} {client.currency}</p>
      </div>
    </div>
  )
}
