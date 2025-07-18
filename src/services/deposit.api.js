import api from './api'

// Obtener el ID del cliente por ID de usuario
export const getClientIdByUserId = async (userId) => {
  try {
    const res = await api.get(`/client/getClientByUser/${userId}`)
    if (res.data && res.data.success && res.data.client && res.data.client._id) {
      return res.data.client._id
    }
    console.warn('No se pudo obtener el ID del cliente para el usuario:', userId, res.data.message)
    return null
  } catch (err) {
    console.error('Error al obtener el ID del cliente por ID de usuario:', err?.response?.data?.message || err.message)
    return null
  }
}

// Crear un depósito
export const createDeposit = async (depositData) => {
  try {
    const res = await api.post('/deposit/createDeposit', depositData)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al crear el depósito'
    }
  }
}

// Crear un movimiento
export const createMovement = async (movementData) => {
  try {
    const res = await api.post('/movement/createMovement', movementData)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al crear el movimiento'
    }
  }
}
