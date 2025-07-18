export const validateRegister = (form) => {
  const errors = {}

  if (!form.name.trim()) errors.name = 'El nombre es obligatorio'
  if (!form.surname.trim()) errors.surname = 'El apellido es obligatorio'
  if (!form.username.trim()) errors.username = 'El nombre de usuario es obligatorio'
  if (!form.email.includes('@')) errors.email = 'Correo inválido'
  if (form.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres'
  if (!form.phone.trim() || form.phone.length < 8) errors.phone = 'Teléfono inválido'
  if (!form.dpi.trim() || form.dpi.length !== 13) errors.dpi = 'DPI inválido (13 dígitos)'
  if (!form.job.trim()) errors.job = 'Trabajo requerido'
  if (!form.address.trim()) errors.address = 'Dirección requerida'
  if (!form.monthlyIncome || isNaN(form.monthlyIncome) || Number(form.monthlyIncome) < 100)
    errors.monthlyIncome = 'Ingreso mensual debe ser al menos Q100'

  return errors
}

export const validateLogin = ({ email, password }) => {
  const errors = {}
  if (!email.includes('@')) errors.email = 'Correo inválido'
  if (password.length < 8) errors.password = 'Contraseña muy corta'
  return errors
}
