import { createContext, useContext, useEffect, useState } from 'react'
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct as updateProductRequest
} from '../services/product.api'

export const ProductsContext = createContext()

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([])

  const loadProducts = async () => {
    const res = await getAllProducts()
    if (!res.error) setProducts(res.products)
  }

  const addProduct = async (data) => {
    const res = await createProduct(data)
    if (!res.error) setProducts([res.product, ...products])
    return res
  }

  const updateProduct = async (id, data) => {
    const res = await updateProductRequest(id, data)
    if (!res.error) {
        setProducts(products.map(p => p._id === id ? res.updated : p))
    }
    return res
    }
  const deleteProductHandler = async (id) => {
    const res = await deleteProduct(id)
    if (!res.error) setProducts(products.filter(p => p._id !== id))
    return res
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <ProductsContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        deleteProduct: deleteProductHandler,
        updateProduct
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}
