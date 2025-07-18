import { useEffect, useState } from 'react'
import { useClients } from '../shared/hooks/useClients'
import { toast } from 'react-toastify'
import { getClientProfile } from '../services/client.api'
import { Button } from './Button'
import { useAuth } from '../contexts/AuthContext'

export const ClientForm = ({ clientId, onSuccess }) => {
  const { getClientById, updateClient, clientSelected } = useClients()
  const { user } = useAuth()

  const [form, setForm] = useState({
    address: '',
    job: '',
    monthlyIncome: '',
    currency: 'GTQ' // Valor por defecto para evitar error
  })

  const [saving, setSaving] = useState(false)
  const isProfile = user?.role === 'CLIENT'

  const loadClient = async () => {
    if (isProfile) {
      const res = await getClientProfile()
      if (res?.success) {
        setForm({
          address: res.client.address || '',
          job: res.client.job || '',
          monthlyIncome: res.client.monthlyIncome || '',
          currency: res.client.currency || 'GTQ'
        })
      } else {
        toast.error(res.message || 'No se pudo cargar el perfil')
      }
    } else {
      await getClientById(clientId)
    }
  }

  useEffect(() => {
    loadClient()
  }, [clientId])

  useEffect(() => {
    if (!isProfile && clientSelected) {
      setForm({
        address: clientSelected.address || '',
        job: clientSelected.job || '',
        monthlyIncome: clientSelected.monthlyIncome || '',
        currency: clientSelected.currency || 'GTQ'
      })
    }
  }, [clientSelected])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const data = {
      address: form.address,
      job: form.job,
      monthlyIncome: Number(form.monthlyIncome),
      currency: form.currency
    }

    console.log('Datos enviados:', data)

    const res = isProfile
      ? await updateOwnClientProfile(data)
      : await updateClient(clientId, data)

    if (res?.success) {
      toast.success(res.message || 'Cliente actualizado')
      onSuccess?.()
    } else {
      toast.error(res.message || 'Error al actualizar')
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="dashboard-card">
      <h3>{isProfile ? 'Editar Perfil' : 'Editar Cliente'}</h3>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Dirección"
          required
        />
        <input
          name="job"
          value={form.job}
          onChange={handleChange}
          placeholder="Trabajo"
          required
        />
        <input
          name="monthlyIncome"
          value={form.monthlyIncome}
          onChange={handleChange}
          placeholder="Ingreso mensual"
          type="number"
          min={100}
          required
        />
        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona moneda</option>
          <option value="GTQ">GTQ</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="PEN">PEN</option>
          <option value="JPY">JPY</option>
        </select>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Button
          text={saving ? 'Guardando...' : 'Guardar cambios'}
          type="submit"
          disabled={saving}
        />
      </div>
    </form>
  )
}
