import api from './api'

export const getAllFavorites = async () => {
  try {
    const res = await api.get('/favorite/getAllFavorites') 
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || 'Error al obtener favoritos' }
  }
}

export const createFavorite = async (data) => {
  try {
    const res = await api.post('/favorite/addFavorite', data)
    return res.data
  } catch (err) {
    console.error(' Error al crear favorito:', err?.response?.data || err.message)
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al crear favorito',
      details: err?.response?.data
    }
  }
}



export const deleteFavorite = async (id) => {
  try {
    const res = await api.delete(`/favorite/deleteFavorite/${id}`) // ✅ prefijo correcto
    return res.data
  } catch (err) {
    return { error: true, message: err?.response?.data?.message || 'Error al eliminar favorito' }
  }
}
