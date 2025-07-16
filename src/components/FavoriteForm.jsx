import { useState } from 'react'
import { useProducts } from '../shared/hooks/useProducts'
import { toast } from 'react-toastify'

export const ProductForm = ({ onSuccess }) => {
  const { addProduct } = useProducts()
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'USD' // valor por defecto
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: name === 'price' ? Number(value) : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!data.name || !data.description || data.price === '' || !data.currency) {
      toast.error('Todos los campos son obligatorios')
      return
    }

    const res = await addProduct(data)

    if (res?.success) {
      toast.success('Producto agregado con éxito')
      setData({ name: '', description: '', price: '', currency: 'USD' })
      if (onSuccess) onSuccess()
    } else {
      toast.error(res?.message || 'Error al agregar producto')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="dashboard-card">
      <h3>Agregar Producto</h3>

      <input
        type="text"
        name="name"
        placeholder="Nombre del producto"
        value={data.name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="description"
        placeholder="Descripción"
        value={data.description}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Precio"
        value={data.price}
        onChange={handleChange}
        required
        min="0.01"
        step="0.01"
      />

      <select name="currency" value={data.currency} onChange={handleChange} required>
        <option value="">Seleccionar moneda</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="PEN">PEN</option>
      </select>

      <button type="submit">Agregar</button>
    </form>
  )
}
