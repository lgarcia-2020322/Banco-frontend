import { useState } from 'react'
import { registerRequest } from '../services/auth.api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Particles from './Particles'

export const Register = ({ switchAuthHandler }) => {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    dpi: '',
    job: '',
    address: '',
    monthlyIncome: '',
    currency: 'GTQ'
  })

  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await registerRequest(form)
    if (res.error) {
      toast.error(res.message || 'Error al registrarse')
      return
    }

    toast.success('Cliente registrado con éxito')
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

      <h2 style={{ textAlign: 'center' }}>Registro Cliente</h2>

      {[
        { name: 'name', label: 'Nombre' },
        { name: 'surname', label: 'Apellido' },
        { name: 'username', label: 'Usuario' },
        { name: 'email', label: 'Correo', type: 'email' },
        { name: 'password', label: 'Contraseña', type: 'password' },
        { name: 'phone', label: 'Teléfono' },
        { name: 'dpi', label: 'DPI' },
        { name: 'job', label: 'Trabajo' },
        { name: 'address', label: 'Dirección' },
        { name: 'monthlyIncome', label: 'Ingreso Mensual', type: 'number' }
      ].map(({ name, label, type = 'text' }) => (
        <div className="form__group" key={name}>
          <input
            name={name}
            type={type}
            className="form__field"
            placeholder=""
            value={form[name]}
            onChange={handleChange}
            required
          />
          <label htmlFor={name} className="form__label">{label}</label>
        </div>
      ))}

      <div className="form__group">
        <select
          name="currency"
          className="form__field"
          value={form.currency}
          onChange={handleChange}
          required
        >
          <option value="GTQ">Quetzales (GTQ)</option>
          <option value="USD">Dólares (USD)</option>
          <option value="EUR">Euros (EUR)</option>
          <option value="PEN">Soles (PEN)</option>
          <option value="JPY">Yenes (JPY)</option>
        </select>
        <label htmlFor="currency" className="form__label">Moneda</label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button className="Btn" type="submit">
          Registrarse
        </button>
      </div>

      <p className="auth-form-switch-label">
        ¿Ya tienes cuenta?
        <span className="link-switch" onClick={switchAuthHandler}>
          &nbsp;Inicia sesión
        </span>
      </p>
    </form>
    </div>
    </div>
    </div>
  )
}
