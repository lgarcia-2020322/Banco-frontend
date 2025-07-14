import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useUsers } from '../shared/hooks/useUsers'
import { Button } from './Button'

export const UserForm = ({ userId, onSuccess }) => {
  const { getUserById, updateUser, userSelected } = useUsers()

  const [form, setForm] = useState({
    username: '',
    email: '',
    role: ''
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (userId) getUserById(userId)
  }, [userId])

  useEffect(() => {
    if (userSelected) {
      setForm({
        username: userSelected.username || '',
        email: userSelected.email || '',
        role: userSelected.role || ''
      })
    }
  }, [userSelected])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const res = await updateUser(userId, form)

    if (res?.success) {
      toast.success('Usuario actualizado')
      onSuccess?.()
    } else {
      toast.error('Error al actualizar')
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="dashboard-card">
      <h3>Editar usuario</h3>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Nombre de usuario"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona rol</option>
          <option value="ADMIN">ADMIN</option>
          <option value="CLIENT">CLIENT</option>
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
