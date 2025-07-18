import { useState } from 'react'
import { useFavorites } from '../shared/hooks/useFavorites'
import { toast } from 'react-toastify'

export const FavoriteForm = ({ onSuccess }) => {
  const { addFavorite } = useFavorites()
  const [data, setData] = useState({
    alias: '',
    accountNumber: '',
    bankName: '',
    currency: 'GTQ'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!data.alias || !data.accountNumber || !data.bankName || !data.currency) {
      toast.error('Todos los campos son obligatorios')
      return
    }

    const res = await addFavorite(data)

    if (res?.success) {
      toast.success('Favorito agregado con éxito')
      setData({ alias: '', accountNumber: '', bankName: '', currency: 'GTQ' })
      if (onSuccess) onSuccess()
    } else {
      toast.error(res?.message || 'Error al agregar favorito')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="dashboard-card">
      <h3>Agregar Favorito</h3>

      <input
        type="text"
        name="alias"
        placeholder="Alias"
        value={data.alias}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="accountNumber"
        placeholder="Número de cuenta"
        value={data.accountNumber}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="bankName"
        placeholder="Nombre del banco"
        value={data.bankName}
        onChange={handleChange}
        required
      />

      <select name="currency" value={data.currency} onChange={handleChange} required>
        <option value="GTQ">GTQ</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="PEN">PEN</option>
        <option value="JPY">JPY</option>
      </select>

      <button type="submit">Agregar</button>
    </form>
  )
}
