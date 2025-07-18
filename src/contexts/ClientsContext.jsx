// contexts/ClientsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import {
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientByUserIdRequest // <--- ¡NUEVA IMPORTACIÓN!
} from '../services/client.api'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext' // Importamos useAuth para obtener el ID del usuario

export const ClientsContext = createContext()
export const useClientsContext = () => useContext(ClientsContext)

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]) // Para la lista general de clientes (admin)
  const [clientSelected, setClientSelected] = useState(null) // Para el cliente específico (admin)
  const [loading, setLoading] = useState(false)
  const [authenticatedClient, setAuthenticatedClient] = useState(null) // <--- ¡NUEVO ESTADO para el cliente del usuario logueado!
  const { user } = useAuth() // Obtiene el usuario (incluyendo su _id) del AuthContext

  const loadAllClients = async () => {
    try {
      setLoading(true)
      const res = await getAllClients()
      if (!res.error) {
        setClients(res.clients)
      } else {
        toast.error(res.message || 'Error al cargar clientes')
      }
    } catch (err) {
      toast.error('Error al cargar clientes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getClientByIdHandler = async (id) => {
    try {
      const res = await getClientById(id)
      if (!res.error) {
        setClientSelected(res.client)
      } else {
        toast.error(res.message || 'Error al obtener cliente')
      }
    } catch (err) {
      toast.error('Error al obtener cliente')
      console.error(err)
    }
  }

  const updateClientHandler = async (id, data) => {
    try {
      const res = await updateClient(id, data)
      if (!res.error) {
        await loadAllClients() // Recarga la lista para los administradores
        toast.success("Cliente actualizado con éxito.")
        // Si el cliente actualizado es el autenticado, actualízalo también
        if (authenticatedClient && authenticatedClient._id === id) {
            setAuthenticatedClient(prev => ({ ...prev, ...data }));
        }
        return res
      } else {
        toast.error(res.message || 'Error al actualizar cliente')
      }
    } catch (err) {
      toast.error('Error al actualizar cliente')
      console.error(err)
    }
  }

  const deleteClientHandler = async (id) => {
    try {
      const res = await deleteClient(id)
      if (!res.error) {
        await loadAllClients() // Recarga la lista para los administradores
        toast.success("Cliente eliminado con éxito.")
        // Si el cliente eliminado es el autenticado, lo limpiamos
        if (authenticatedClient && authenticatedClient._id === id) {
            setAuthenticatedClient(null);
        }
        return res
      } else {
        toast.error(res.message || 'Error al eliminar cliente')
      }
    } catch (err) {
      toast.error('Error al eliminar cliente')
      console.error(err)
    }
  }

  // NUEVO useEffect para cargar el cliente del usuario logueado
  // Esto se ejecuta cuando el 'user' de AuthContext cambia (ej. al loguearse)
  useEffect(() => {
    const loadAuthenticatedClient = async () => {
      // Solo si hay un usuario logueado y es un cliente (user._id es el ID del usuario)
      if (user && user._id && user.role === 'CLIENT') {
        try {
          const res = await getClientByUserIdRequest(user._id) // Usa user._id para buscar el cliente
          if (res.success && res.client) {
            setAuthenticatedClient(res.client) // Guarda el cliente completo del usuario logueado
            console.log("Cliente autenticado cargado:", res.client); // Debug
          } else {
            setAuthenticatedClient(null) // Si no se encuentra el cliente asociado
            console.warn("No se encontró cliente asociado para el usuario:", user._id, res.message)
          }
        } catch (err) {
          console.error("Error al cargar el cliente autenticado:", err)
          setAuthenticatedClient(null)
        }
      } else {
        setAuthenticatedClient(null) // Limpiar si el usuario no es cliente o no está logueado
      }
    }

    loadAuthenticatedClient()
  }, [user]) // Este efecto se ejecuta cada vez que el objeto 'user' de AuthContext cambia

  // useEffect existente para administradores (SIN CAMBIOS)
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadAllClients()
    } else {
      setClients([]) // Limpia la lista de clientes si el usuario no es admin
    }
  }, [user])

  return (
    <ClientsContext.Provider
      value={{
        clients, // Lista de clientes (para admin)
        clientSelected, // Cliente seleccionado (para admin)
        loading,
        authenticatedClient, // <--- ¡EXPONEMOS EL CLIENTE DEL USUARIO LOGUEADO!
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