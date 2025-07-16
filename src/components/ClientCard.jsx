export const ClientCard = ({ client, onEdit, onDelete }) => {
  const { user, dpi, accountNumber, job, balance, currency } = client

  return (
    <div className="dashboard-card">
      <h3>{user?.name} {user?.surname}</h3>
      <p>DPI: {dpi}</p>
      <p>No. Cuenta: {accountNumber}</p>
      <p>Trabajo: {job}</p>
      <p>Saldo: {balance} {currency}</p>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => onEdit(client)}>Editar</button>
        <button onClick={() => onDelete(client._id)}>Eliminar</button>
      </div>
    </div>
  )
}
