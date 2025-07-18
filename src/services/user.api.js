import api from './api'

export const getAllUsers = async () => {
  try {
    const res = await api.get('/users/all')
    return res.data
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || 'Error al obtener usuarios' }
  }
}

export const getUserById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`)
    return res.data
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || 'Error al obtener usuario' }
  }
}

export const updateUser = async (id, data) => {
  try {
    const res = await api.put(`/users/${id}`, data)
    return res.data
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || 'Error al actualizar usuario' }
  }
}

export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`)
    return res.data
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || 'Error al eliminar usuario' }
  }
}

export const searchUsersByName = async (name) => {
  try {
    const res = await api.post('/users/searchByName', { name })
    return res.data
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || 'Error al buscar usuarios' }
  }
}
