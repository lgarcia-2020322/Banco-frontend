import { createContext, useContext, useState, useEffect } from 'react'
import {
  getAllPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase
} from '../services/purchase.api'
import { toast } from 'react-toastify'

const AdminPurchaseContext = createContext()
export const useAdminPurchases = () => useContext(AdminPurchaseContext)

export const AdminPurchaseProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(false)

  const loadPurchases = async () => {
    try {
      setLoading(true)
      const res = await getAllPurchases()
      setPurchases(res.purchases || [])
    } catch (err) {
      toast.error('Error al cargar compras')
    } finally {
      setLoading(false)
    }
  }

  const createPurchaseHandler = async (data) => {
    try {
      const res = await createPurchase(data)
      toast.success('Compra creada correctamente')
      await loadPurchases()
      return res
    } catch (err) {
      toast.error('Error al crear compra')
      return { error: true }
    }
  }

  const updatePurchaseHandler = async (id, data) => {
    try {
      const res = await updatePurchase(id, data)
      toast.success('Compra actualizada')
      await loadPurchases()
      return res
    } catch (err) {
      toast.error('Error al actualizar compra')
      return { error: true }
    }
  }

  const deletePurchaseHandler = async (id) => {
    try {
      const res = await deletePurchase(id)
      toast.success('Compra eliminada')
      await loadPurchases()
      return res
    } catch (err) {
      toast.error('Error al eliminar compra')
      return { error: true }
    }
  }

  useEffect(() => {
    loadPurchases()
  }, [])

  return (
    <AdminPurchaseContext.Provider
      value={{
        purchases,
        loading,
        createPurchase: createPurchaseHandler,
        updatePurchase: updatePurchaseHandler,
        deletePurchase: deletePurchaseHandler
      }}
    >
      {children}
    </AdminPurchaseContext.Provider>
  )
}