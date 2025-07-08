import { useState } from 'react'
import { registerRequest } from '../../services/auth.api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const register = async (formData) => {
    setLoading(true)

    const res = await registerRequest(formData)

    if (res.error) {
      const msg = res.message?.toLowerCase()

      if (msg.includes('dpi already exists')) {
        toast.error('El DPI ya está registrado')
      } else if (msg.includes('username already exists')) {
        toast.error('El nombre de usuario ya está en uso')
      } else if (msg.includes('email already exists')) {
        toast.error('El correo ya está registrado')
      } else if (msg.includes('password must contain')) {
        toast.error('La contraseña debe tener mayúscula, minúscula, número y carácter especial')
      } else if (msg.includes('is not allowed')) {
        toast.error('Moneda no permitida. Usa: GTQ, USD, EUR, PEN o JPY')
      } else {
        toast.error(res.message)
      }

      setLoading(false)
      return null
    }

    toast.success('Cliente registrado con éxito')
    navigate('/dashboard')
    setLoading(false)
    return res.data
  }

  return { register, loading }
}
