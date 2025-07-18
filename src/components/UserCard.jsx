export const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="dashboard-card">
      <h3>{user?.username}</h3>
      <p>Email: {user?.email}</p>
      <p>Rol: {user?.role}</p>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => onEdit(user)}>Editar</button>
        <button onClick={() => onDelete(user._id)}>Eliminar</button>
      </div>
    </div>
  )
}
