import { useState } from 'react'
import { useProducts } from '../shared/hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { ProductForm } from '../components/ProductForm'

export const ProductsPage = () => {
  const { products, deleteProduct } = useProducts()
  const [showForm, setShowForm] = useState(false)

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Seguro de eliminar este producto?')
    if (confirm) await deleteProduct(id)
  }

  return (
    <div className="dashboard-main">
      <h2>Gestión de Productos</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Ocultar formulario' : 'Agregar nuevo producto'}
      </button>

      {showForm && <ProductForm onSuccess={() => setShowForm(false)} />}

      {products.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <div className="favorites-container">
          {products.map((p) => (
            <ProductCard key={p._id} prod={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
