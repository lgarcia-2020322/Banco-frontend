import { useFavorites } from '../shared/hooks/useFavorites'
import { FavoriteCard } from '../components/FavoriteCard'
import { FavoriteForm } from '../components/FavoriteForm'
import { useState } from 'react'

export const FavoritesPage = () => {
  const { favorites, deleteFavorite } = useFavorites()
  const [showForm, setShowForm] = useState(false)
  const [exitingIds, setExitingIds] = useState([])

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Seguro de eliminar este favorito?')
    if (!confirm) return

    // 1. Marca como saliendo
    setExitingIds((prev) => [...prev, id])

    // 2. Espera animación antes de eliminar
    setTimeout(async () => {
      await deleteFavorite(id)
      setExitingIds((prev) => prev.filter((exitId) => exitId !== id))
    }, 300) // duración igual a la animación de salida
  }

  return (
    <div className="dashboard-main">
      <h2>Mis Favoritos</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Ocultar formulario' : 'Agregar nuevo favorito'}
      </button>

      {showForm && <FavoriteForm onSuccess={() => setShowForm(false)} />}

      {favorites.length === 0 ? (
        <p>No hay favoritos aún</p>
      ) : (
        <div className="favorites-container">
          {favorites.map((fav, index) => (
            <FavoriteCard
              key={fav._id}
              fav={fav}
              index={index}
              exiting={exitingIds.includes(fav._id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
