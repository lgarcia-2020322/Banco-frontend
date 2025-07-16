//ClientContext
import { createContext, useContext, useState, useEffect } from 'react'
import {
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} from '../services/client.api'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'

export const ClientsContext = createContext()
export const useClientsContext = () => useContext(ClientsContext)

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([])
  const [clientSelected, setClientSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'ADMIN') loadAllClients()
  }, [user])

  const loadAllClients = async () => {
    try {
      setLoading(true)
      const res = await getAllClients()
      setClients(res.clients)
    } catch (err) {
      toast.error('Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  const getClientByIdHandler = async (id) => {
    try {
      const res = await getClientById(id)
      setClientSelected(res.client)
    } catch (err) {
      toast.error('Error al obtener cliente')
    }
  }

  const updateClientHandler = async (id, data) => {
    try {
      const res = await updateClient(id, data)
      await loadAllClients()
      return res
    } catch (err) {
      toast.error('Error al actualizar cliente')
    }
  }

  const deleteClientHandler = async (id) => {
    try {
      const res = await deleteClient(id)
      await loadAllClients()
      return res
    } catch (err) {
      toast.error('Error al eliminar cliente')
    }
  }

  return (
    <ClientsContext.Provider
      value={{
        clients,
        clientSelected,
        loading,
        loadAllClients,
        getClientById: getClientByIdHandler,
        updateClient: updateClientHandler,
        deleteClient: deleteClientHandler
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}
