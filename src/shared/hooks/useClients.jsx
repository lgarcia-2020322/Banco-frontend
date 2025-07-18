import { useContext } from 'react'
import { ClientsContext } from '../../contexts/ClientsContext'

export const useClients = () => {
  const context = useContext(ClientsContext)
  if (!context) {
    throw new Error('useClients debe usarse dentro de ClientsProvider')
  }
  return context
}
