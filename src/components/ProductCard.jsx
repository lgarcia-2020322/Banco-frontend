import { useState } from 'react'
import { useProducts } from '../shared/hooks/useProducts'

export const ProductCard = ({ prod, onDelete }) => {
  const { updateProduct } = useProducts()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...prod })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    const res = await updateProduct(prod._id, form)
    if (res.success) setEditing(false)
  }

  return (
    <div className="product-item">
      {editing ? (
        <>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
          />
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción"
          />

          <div className="product-price-group">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Precio"
            />
            <select name="currency" value={form.currency} onChange={handleChange}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="PEN">PEN</option>
            </select>
          </div>

          <button onClick={handleUpdate}>Guardar</button>
          <button onClick={() => setEditing(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <h3>{prod.name}</h3>
          <p>{prod.description}</p>
          <p><strong>Precio:</strong> Q{prod.price}</p>
          <p><strong>Agregado:</strong> {new Date(prod.createdAt).toLocaleDateString()}</p>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setEditing(true)}>Editar</button>
            <button onClick={() => onDelete(prod._id)}>Eliminar</button>
          </div>
        </>
      )}
    </div>
  )
}
