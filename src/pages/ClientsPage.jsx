import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useClients } from '../shared/hooks/useClients'
import { ClientCard } from '../components/ClientCard'
import { ClientForm } from '../components/ClientForm'
import { useAuth } from '../contexts/AuthContext'

export const ClientsPage = () => {
  const { user } = useAuth()
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />

  const {
    clients = [],
    deleteClient,
    loadAllClients
  } = useClients()

  const [selectedClientId, setSelectedClientId] = useState(null)

  useEffect(() => {
    loadAllClients()
  }, [])

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Seguro de eliminar este cliente?')
    if (confirm) await deleteClient(id)
  }

  return (
    <div className="dashboard-main">
      <h2>Gestión de Clientes</h2>

      {Array.isArray(clients) && clients.length === 0 ? (
        <p>No hay clientes disponibles</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {clients
            .filter(c => c.user?.status !== false)
            .map((c) => (
              <ClientCard
                key={c._id}
                client={c}
                onEdit={() => setSelectedClientId(c._id)}
                onDelete={() => handleDelete(c._id)}
              />
            ))}
        </div>
      )}

      {selectedClientId && (
        <div className="modal-overlay" onClick={() => setSelectedClientId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ClientForm clientId={selectedClientId} onSuccess={() => setSelectedClientId(null)} />
            <button className="Btn" onClick={() => setSelectedClientId(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
