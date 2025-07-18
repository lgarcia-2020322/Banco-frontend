import { useState } from "react"
import { useAdminPurchases } from "../contexts/AdminPurchaseContext"
import { useClients } from "../shared/hooks/useClients"
import { useProducts } from "../shared/hooks/useProducts"
import "../styles/Admin-purchase-view.css"

const AdminPurchaseView = () => {
  const [formData, setFormData] = useState({
    client: "",
    product: "",
    amount: "",
    currency: "GTQ",
    description: "",
    status: "completed",
  })

  const { purchases, createPurchase, deletePurchase } = useAdminPurchases()
  const { clients = [] } = useClients()
  const { products = [] } = useProducts()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await createPurchase(formData)
    if (!result?.error) {
      setFormData({
        client: "",
        product: "",
        amount: "",
        currency: "GTQ",
        description: "",
        status: "completed",
      })
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "completed": return "status-completed"
      case "pending": return "status-pending"
      case "failed": return "status-failed"
      default: return ""
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="admin-purchase-container">
      <div className="admin-header">
        <h1>Gestión de Compras - Panel Administrativo</h1>
      </div>

      <div className="form-section">
        <h2>Registrar Nueva Compra</h2>
        <form onSubmit={handleSubmit} className="purchase-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="client">Cliente *</label>
              <select id="client" name="client" value={formData.client} onChange={handleInputChange} required>
                <option value="">Seleccionar cliente</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>
                     {c.user?.name || 'Sin nombre'} {c.user?.surname || ''} - Saldo: {c.balance?.toFixed(2) || 'N/A'} {c.currency || ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="product">Producto *</label>
              <select id="product" name="product" value={formData.product} onChange={handleInputChange} required>
                <option value="">Seleccionar producto</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name || 'Sin nombre'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Monto *</label>
              <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} min="0.01" step="0.01" required />
            </div>
            <div className="form-group">
              <label htmlFor="currency">Moneda *</label>
              <select id="currency" name="currency" value={formData.currency} onChange={handleInputChange} required>
                <option value="GTQ">GTQ - Quetzal</option>
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Estado</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="completed">Completado</option>
                <option value="pending">Pendiente</option>
                <option value="failed">Fallido</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Descripción</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} maxLength="200" rows="3" />
            <small className="char-count">{formData.description.length}/200</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">Registrar Compra</button>
            <button type="button" className="btn-secondary" onClick={() => setFormData({
              client: "", product: "", amount: "", currency: "GTQ",
              description: "", status: "completed"
            })}>Limpiar</button>
          </div>
        </form>
      </div>

      <div className="history-section">
        <h2>Historial de Compras</h2>
        <div className="table-container">
          <table className="purchases-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Referencia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td>{formatDate(purchase.purchaseDate || purchase.createdAt)}</td>
                  <td>
                    <div className="client-info">
                      <strong>{purchase.client?.name || '---'}</strong>
                      <small>{purchase.client?.email || ''}</small>
                    </div>
                  </td>
                  <td>
                    <div className="product-info">
                      <strong>{purchase.product?.name || '---'}</strong>
                      <small>{purchase.product?.code || ''}</small>
                    </div>
                  </td>
                  <td>
                    <span className="amount">{purchase.amount?.toFixed(2)} {purchase.currency}</span>
                  </td>
                  <td>
                    <span className={`status ${getStatusClass(purchase.status)}`}>{purchase.status}</span>
                  </td>
                  <td className="reference">{purchase.referenceCode}</td>
                  <td>
                    <div className="actions">
                      <button className="btn-action delete" onClick={() => deletePurchase(purchase._id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminPurchaseView
