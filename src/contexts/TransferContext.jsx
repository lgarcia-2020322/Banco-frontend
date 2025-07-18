import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getClientInfoByUserId,
  getAllClients,
  createTransfer as apiCreateTransfer,
  createMovement as apiCreateMovement
} from '../services/transfer.api'

const TransferContext = createContext()

export const useTransfer = () => useContext(TransferContext)

export const TransferProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [client, setClient] = useState(null)
  const [clients, setClients] = useState([])

  const loadClientData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const userString = localStorage.getItem('user')
      const currentUser = userString ? JSON.parse(userString) : null
      if (!currentUser?._id) throw new Error('No hay usuario autenticado')

      const res = await getClientInfoByUserId(currentUser._id)
      if (!res.success) throw new Error(res.message || 'No se pudo obtener info del cliente')

      setClient(res.client)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAllClients()
      if (res.error) throw new Error(res.message || 'Error al obtener clientes')
      setClients(res.clients || res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadClientData()
    loadClients()
  }, [loadClientData, loadClients])

  const processTransfer = async (transferData) => {
    setLoading(true)
    setError(null)
    try {
      if (!client) throw new Error('No hay cliente autenticado')

      // Datos para la transferencia
      const dataToSend = {
        amount: transferData.amount,
        currency: transferData.currency,
        description: transferData.description,
        referenceCode: transferData.referenceCode,
        fromAccount: client._id,
        toAccount: transferData.toAccount,
        initiatedBy: client._id,
      }

      const result = await apiCreateTransfer(dataToSend)
      if (result.error) throw new Error(result.message || 'Error al crear transferencia')

      // Saldo de prueba (hasta que consultes el saldo real de destino)
      const balanceOrigen = 100000
      const balanceDestino = 50000
      const amount = Number(transferData.amount)

      const balanceAfterOut = balanceOrigen - amount
      const balanceAfterIn = balanceDestino + amount

      console.log('Balance origen (prueba):', balanceOrigen)
      console.log('Balance destino (prueba):', balanceDestino)
      console.log('Amount:', amount)
      console.log('Balance After salida:', balanceAfterOut)
      console.log('Balance After entrada:', balanceAfterIn)

      // Movimiento salida (monto negativo)
      const movementOut = {
        client: client._id,
        type: 'transfer',
        amount: -Math.abs(amount),
        currency: ['GTQ', 'USD', 'EUR'].includes(transferData.currency) ? transferData.currency : 'USD',
        balanceAfter: balanceAfterOut,
        referenceId: result.transfer._id,
        description: `Transferencia enviada: ${transferData.description || 'Sin descripción'}`,
      }
      console.log('Movimiento salida a enviar:', movementOut)
      const movementOutRes = await apiCreateMovement(movementOut)
      if (movementOutRes.error) throw new Error('Error al crear movimiento de salida')

      // Movimiento entrada (monto positivo)
      const movementIn = {
        client: transferData.toAccount,
        type: 'transfer',
        amount: Math.abs(amount),
        currency: ['GTQ', 'USD', 'EUR'].includes(transferData.currency) ? transferData.currency : 'USD',
        balanceAfter: balanceAfterIn,
        referenceId: result.transfer._id,
        description: `Transferencia recibida: ${transferData.description || 'Sin descripción'}`,
      }
      console.log('Movimiento entrada a enviar:', movementIn)
      const movementInRes = await apiCreateMovement(movementIn)
      if (movementInRes.error) throw new Error('Error al crear movimiento de entrada')

      setLoading(false)
      return { success: true, transfer: result.transfer }
    } catch (err) {
      setError(err.message)
      setLoading(false)
      return { success: false, message: err.message }
    }
  }

  return (
    <TransferContext.Provider value={{ loading, error, client, clients, processTransfer }}>
      {children}
    </TransferContext.Provider>
  )
}
