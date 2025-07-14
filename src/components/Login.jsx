import { useState } from 'react'
import { loginRequest, loginAdminRequest } from '../services/auth.api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Particles from './Particles'


export const Login = ({ switchAuthHandler }) => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [role, setRole] = useState('CLIENT')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    const credentials = { email: form.email, password: form.password }

    const res = role === 'ADMIN'
      ? await loginAdminRequest(credentials)
      : await loginRequest(credentials)

    if (res.error) {
      toast.error('Credenciales incorrectas')
      return
    }

    login(res.data.user, res.data.token)
    toast.success('Sesión iniciada')
    navigate('/dashboard')
  }

  return (
    <div className="auth-wrapper">
      <Particles
         particleColors={['#000000']}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
        <div className="auth-container">
            <div className="center-content">
      <form onSubmit={handleSubmit} className="auth-form">
        <img
          src="src/assets/LogoB.PNG"
          alt="Logo Banco"
          style={{ width: '150px', margin: '0 auto', display: 'block' }}
        />

        <h2 style={{ textAlign: 'center' }}>Iniciar Sesión</h2>

        <div className="form__group">
          <input
            name="email"
            type="email"
            className="form__field"
            placeholder=""
            required
            value={form.email}
            onChange={handleChange}
          />
          <label htmlFor="email" className="form__label">Correo</label>
        </div>

        <div className="form__group">
          <input
            name="password"
            type="password"
            className="form__field"
            placeholder=""
            required
            value={form.password}
            onChange={handleChange}
          />
          <label htmlFor="password" className="form__label">Contraseña</label>
        </div>

        <div className="form__group">
          <select
            name="role"
            className="form__field"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="CLIENT">Cliente</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <label htmlFor="role" className="form__label">Rol</label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button className="Btn" type="submit">
            Entrar
          </button>
        </div>

        <p className="auth-form-switch-label">
          ¿No tienes cuenta?
          <span className="link-switch" onClick={switchAuthHandler}>
            &nbsp;Regístrate
          </span>
        </p>
      </form>
      </div>
      </div>
    </div>
  )
}
