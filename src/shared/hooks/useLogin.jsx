// /src/shared/hooks/useLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginRequest, loginAdminRequest } from '../../services/auth.api'
import { useAuth } from '../../contexts/AuthContext'

export const useLogin = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'CLIENT' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = form.role === 'ADMIN'
        ? await loginAdminRequest({ userLoggin: form.email, password: form.password })
        : await loginRequest({ email: form.email, password: form.password })

      if (res.error) {
        toast.error(res.message || 'Error al iniciar sesión')
        return
      }

      login(res.data.user, res.data.token)
      toast.success('Sesión iniciada correctamente')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    handleChange,
    handleSubmit
  }
}
