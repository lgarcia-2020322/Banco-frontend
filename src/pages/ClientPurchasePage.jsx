// ClientPurchaseView.jsx
import React, { useState, useEffect } from "react"
import { useAdminPurchases } from "../contexts/AdminPurchaseContext"
import { useProducts } from "../shared/hooks/useProducts"
import { useAuth } from "../contexts/AuthContext"
import { useClientsContext } from "../contexts/ClientsContext"
import { toast } from "react-toastify"
import "../styles/client-purchase-view.css"

const ClientPurchaseView = () => {
  const { createPurchase, purchases } = useAdminPurchases()
  const { products = [] } = useProducts()
  const { user } = useAuth()
  const { authenticatedClient } = useClientsContext()

  const [formData, setFormData] = useState({
    client: "",
    product: "",
    amount: "",
    currency: "GTQ",
    description: "",
  })

  // === D E B U G G I N G ===
  useEffect(() => {
    console.log("Usuario autenticado (user):", user);
    console.log("Cliente autenticado (authenticatedClient):", authenticatedClient);
    console.log("Productos disponibles (products desde useProducts):", products);
    console.log("Todas las compras (purchases desde useAdminPurchases):", purchases);
  }, [user, authenticatedClient, products, purchases]);
  // =========================

  // Actualiza formData.client cuando authenticatedClient esté disponible
  useEffect(() => {
    if (authenticatedClient?._id && formData.client !== authenticatedClient._id) {
      setFormData(prev => ({ ...prev, client: authenticatedClient._id }));
    }
  }, [authenticatedClient, formData.client]);

  // Filtra las compras del usuario logueado
  // *** ASUMIMOS que `purchase.client` en el array `purchases` es el ID del CLIENTE (6877e68a2fc0e85d0230da0b) ***
  // Si en tu backend 'purchase.client' viene populado como un objeto completo del cliente, entonces sería 'p.client._id'
  const userPurchases = purchases.filter(p => {
    return p.client === authenticatedClient?._id;
  });

  console.log("Compras del usuario filtradas (userPurchases):", userPurchases); // Log para ver el resultado del filtro

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que tenemos el ID del cliente antes de enviar
    if (!formData.product || !formData.amount || !formData.client) {
      toast.error("Producto, monto y cliente son obligatorios. Asegúrate de estar logueado como cliente.");
      return
    }

    const dataToSend = {
      ...formData,
      client: formData.client, // formData.client ya tiene el ID del cliente correcto
    };

    try {
      console.log("Enviando datos de compra:", dataToSend); // Debug

      const res = await createPurchase(dataToSend);
      if (!res?.error) {
        toast.success("Compra realizada con éxito!");
        setFormData(prev => ({
          ...prev,
          product: "",
          amount: "",
          description: "",
        }));
      } else {
        toast.error(`Error al realizar la compra: ${res.message || "Error desconocido"}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error inesperado.";
      toast.error(`No se pudo completar la compra: ${errorMessage}`);
      console.error("Error completo en handleSubmit:", error);
    }
  }

  return (
    <div className="client-purchase-container">
      <div className="client-header">
        <h1>Mis Compras</h1>
        <div className="user-info">
          <span className="welcome">Bienvenido, {user?.name || "Cliente"}</span>
        </div>
      </div>

      <div className="purchase-form-section">
        <h2>Realizar Nueva Compra</h2>
        <form onSubmit={handleSubmit} className="client-purchase-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="product">Producto *</label>
              <select id="product" name="product" value={formData.product} onChange={handleInputChange} required>
                <option value="">Seleccionar producto</option>
                {products && products.length > 0 ? (
                  products.map(prod => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name} - Q{prod.price?.toFixed(2) || 'N/A'}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {Array.isArray(products) && products.length === 0 ? "No hay productos disponibles." : "Cargando productos..."}
                  </option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Monto (Q)*</label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Moneda de Pago</label>
              <select id="currency" name="currency" value={formData.currency} onChange={handleInputChange}>
                <option value="GTQ">GTQ - Quetzal</option>
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Notas adicionales</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength="200"
              rows="3"
              placeholder="Notas sobre tu compra (opcional)"
            />
            <small className="char-count">{formData.description.length}/200</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-purchase">Proceder con la Compra</button>
            <button type="button" className="btn-clear" onClick={() => setFormData({ ...formData, product: "", amount: "", description: "" })}>
              Limpiar Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientPurchaseView;