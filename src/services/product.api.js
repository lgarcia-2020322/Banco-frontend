import api from './api'

// Obtener todos los productos
export const getAllProducts = async () => {
  try {
    const res = await api.get('/product/getAllProducts') 
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al obtener productos'
    }
  }
}

// Crear un nuevo producto
export const createProduct = async (data) => {
  try {
    const res = await api.post('/product/createProduct', data)
    return res.data
  } catch (err) {
    console.error('❌ Error al crear producto:', err?.response?.data || err.message)
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al crear producto',
      details: err?.response?.data
    }
  }
}

// Actualizar un producto existente
export const updateProduct = async (id, data) => {
  try {
    const res = await api.put(`/product/updateProduct/${id}`, data)
    return res.data
  } catch (err) {
    console.error(' Error al actualizar producto:', err?.response?.data || err.message)
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al actualizar producto'
    }
  }
}

// Eliminar (desactivar) un producto
export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/product/deleteProduct/${id}`)
    return res.data
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al eliminar producto'
    }
  }
}
