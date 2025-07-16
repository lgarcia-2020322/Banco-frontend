import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useUsers } from '../shared/hooks/useUsers'
import { UserCard } from '../components/UserCard'
import { useAuth } from '../contexts/AuthContext'
import { UserForm } from '../components/UserForm'

export const UsersPage = () => {
  const { user } = useAuth()
  const role = user?.role

  if (role !== 'ADMIN') return <Navigate to="/dashboard" />

  const {
    users = [], // <-- valor por defecto para evitar error
    searchUsers,
    deleteUser,
    loadAllUsers
  } = useUsers()

  const [searchValue, setSearchValue] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)

  const handleSearch = async () => {
    if (!searchValue.trim()) return
    await searchUsers(searchValue.trim())
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Seguro de eliminar este usuario?')
    if (confirm) await deleteUser(id)
  }

  return (
    <div className="dashboard-main">
      <h2>Gestión de Usuarios</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
        <button onClick={loadAllUsers}>Ver todos</button>
      </div>

      {Array.isArray(users) && users.length === 0 ? (
        <p>No hay usuarios</p>
      ) : (
        users?.map((u) => (
          <UserCard
            key={u._id}
            user={u}
            onEdit={() => setSelectedUserId(u._id)}
            onDelete={() => handleDelete(u._id)}
          />
        ))
      )}

      {selectedUserId && (
        <div className="modal-overlay" onClick={() => setSelectedUserId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <UserForm userId={selectedUserId} onSuccess={() => setSelectedUserId(null)} />
            <button onClick={() => setSelectedUserId(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
