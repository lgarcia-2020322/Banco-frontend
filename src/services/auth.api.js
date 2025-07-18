import apiClient from './api'

// Registrar cliente
export const registerRequest = async (data) => {
  try {
    const res = await apiClient.post('/auth/registerClient', data)
    return res
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error inesperado al registrar'
    }
  }
}

// Login cliente
export const loginRequest = async (credentials) => {
  try {
    return await apiClient.post('/auth/loginClient', credentials)
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Login error'
    }
  }
}

// Login admin
export const loginAdminRequest = async ({ email, password }) => {
  try {
    return await apiClient.post('/auth/loginAdmin', {
      userLoggin: email,
      password
    })
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || 'Login error'
    }
  }
}
