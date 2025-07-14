import { createContext, useContext, useState, useEffect } from 'react'
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsersByName
} from '../services/user.api'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'

export const UsersContext = createContext()
export const useUsersContext = () => useContext(UsersContext)

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [userSelected, setUserSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user && user.role === 'ADMIN') loadAllUsers()
  }, [user])

  const loadAllUsers = async () => {
    try {
      setLoading(true)
      const res = await getAllUsers()
      setUsers(res.users) // ✅ tu API devuelve { users: [...] }
    } catch (err) {
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const getUserByIdHandler = async (id) => {
    try {
      const res = await getUserById(id)
      setUserSelected(res.user)
    } catch (err) {
      toast.error('Error al obtener usuario')
    }
  }

  const updateUserHandler = async (id, data) => {
    try {
      const res = await updateUser(id, data)
      await loadAllUsers()
      return res
    } catch (err) {
      toast.error('Error al actualizar usuario')
    }
  }

  const deleteUserHandler = async (id) => {
    try {
      const res = await deleteUser(id)
      await loadAllUsers()
      return res
    } catch (err) {
      toast.error('Error al eliminar usuario')
    }
  }

  const searchUsers = async (name) => {
    try {
      const res = await searchUsersByName(name)
      setUsers(res.users)
      toast.success('Usuarios encontrados')
    } catch (err) {
      toast.error('Error al buscar usuarios')
    }
  }

  return (
    <UsersContext.Provider
      value={{
        users,
        userSelected,
        loading,
        loadAllUsers,
        getUserById: getUserByIdHandler,
        updateUser: updateUserHandler,
        deleteUser: deleteUserHandler,
        searchUsers
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}
