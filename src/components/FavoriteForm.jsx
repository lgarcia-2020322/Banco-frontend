import { useState } from 'react'
import { useFavorites } from '../shared/hooks/useFavorites'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './Button'

export const FavoriteForm = ({ onSuccess }) => {
  const { user } = useAuth()
  const { addFavorite } = useFavorites()

  const [form, setForm] = useState({
    alias: '',
    accountNumber: '',
    bankName: '',
    currency: 'USD'
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToSend = {
  alias: form.alias,
  accountNumber: form.accountNumber,
  bankName: form.bankName,
  currency: form.currency
}

    const res = await addFavorite(dataToSend)
    if (res?.success) onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="dashboard-card">
      <h3>Agregar Favorito</h3>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <input
          name="alias"
          value={form.alias}
          onChange={handleChange}
          placeholder="Alias"
          required
        />
        <input
          name="accountNumber"
          value={form.accountNumber}
          onChange={handleChange}
          placeholder="Número de cuenta"
          minLength={10}
          maxLength={10}
          required
        />
        <input
          name="bankName"
          value={form.bankName}
          onChange={handleChange}
          placeholder="Nombre del banco"
          required
        />
        <select name="currency" value={form.currency} onChange={handleChange} required>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="PEN">PEN</option>
          <option value="GTQ">GTQ</option>
        </select>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Button text="Guardar favorito" type="submit" />
      </div>
    </form>
  )
}
