import { createContext, useContext, useState, useEffect } from 'react'
import { getAllFavorites, createFavorite, deleteFavorite } from '../services/favorite.api'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

export const FavoritesContext = createContext()
export const useFavoritesContext = () => useContext(FavoritesContext)

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const { user } = useAuth()

  const loadFavorites = async () => {
    try {
      const res = await getAllFavorites()
      setFavorites(res.favorites || [])
    } catch (err) {
      toast.error('Error al cargar favoritos')
    }
  }

  useEffect(() => {
  if (user?.role === 'CLIENT') {
    console.log('Cargando favoritos de:', user.username)
    loadFavorites()
  }
}, [user])


  const addFavoriteHandler = async (data) => {
    const res = await createFavorite(data)
    if (res.success) {
        toast.success('Favorito agregado')
        await loadFavorites() // 🔁 forza recarga visual
    } else {
        toast.error(res.message || 'Error al agregar favorito')
    }
    return res
    }

  const deleteFavoriteHandler = async (id) => {
    const res = await deleteFavorite(id)
    if (res.success) {
      toast.success('Favorito eliminado')
      await loadFavorites()
    } else {
      toast.error(res.message || 'Error al eliminar favorito')
    }
    return res
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, loadFavorites, addFavorite: addFavoriteHandler, deleteFavorite: deleteFavoriteHandler }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
