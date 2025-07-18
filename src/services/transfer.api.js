import api from './api'

// Obtener todas las cuentas de clientes para el select destino
export const getAllClients = async () => {
  try {
    const res = await api.get('/client/all') // Esta ruta debe devolver clientes con su cuenta bancaria
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al obtener clientes'
    }
  }
}

// Obtener clientId y número de cuenta de cliente logueado por userId
export const getClientInfoByUserId = async (userId) => {
  try {
    const res = await api.get(`/client/getClientByUser/${userId}`)
    // Asumimos que el backend devuelve { client: {...} } con { _id, accountNumber, ... }
    return { success: true, client: res.data.client }
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || 'Error al obtener cliente por userId'
    }
  }
}

// Crear transferencia
export const createTransfer = async (transferData) => {
  try {
    const res = await api.post('/transfer/createTransfer', transferData)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al crear transferencia'
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