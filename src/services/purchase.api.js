import api from './api'

// Crear una compra
export const createPurchase = async (data) => {
  try {
    const res = await api.post('/purchase/createPurchase', data)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al crear la compra'
    }
  }
}

// Obtener todas las compras
export const getAllPurchases = async () => {
  try {
    const res = await api.get('/purchase/getAllPurchases')
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al obtener las compras'
    }
  }
}

// Obtener una compra por ID
export const getPurchaseById = async (id) => {
  try {
    const res = await api.get(`/purchase/getPurchase/id/${id}`)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al obtener la compra'
    }
  }
}

// Actualizar una compra
export const updatePurchase = async (id, data) => {
  try {
    const res = await api.put(`/purchase/updatePurchase/${id}`, data)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al actualizar la compra'
    }
  }
}

// Eliminar una compra
export const deletePurchase = async (id) => {
  try {
    const res = await api.delete(`/purchase/deletePurchase/${id}`)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al eliminar la compra'
    }
  }
}
