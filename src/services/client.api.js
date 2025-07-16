import api from './api'

export const getAllClients = async () => {
  try {
    const res = await api.get('/client/all')
    return res.data
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || 'Error al obtener clientes' }
  }
}

export const getClientById = async (id) => {
  try {
    const res = await api.get(`/client/${id}`)
    return res.data
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || 'Error al obtener cliente' }
  }
}

export const updateClient = async (id, data) => {
  try {
    const res = await api.put(`/client/${id}`, data)
    return res.data
  } catch (err) {
    console.error('Error actualizando cliente:', err.response?.data || err)
    return { error: true, message: err?.response?.data?.message || 'Error al actualizar cliente' }
  }
}

export const deleteClient = async (id) => {
  try {
    const res = await api.delete(`/client/${id}`)
    return res.data
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || 'Error al eliminar cliente' }
  }
}

export const getClientProfile = async () => {
  try {
    const res = await api.get('/client/profile/me')
    return res.data
  } catch (err) {
    console.log('Error obteniendo perfil:', err)
    return { success: false, message: err?.response?.data?.message || 'Error al obtener perfil' }
  }
}
