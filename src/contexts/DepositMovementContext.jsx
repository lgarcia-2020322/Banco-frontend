// src/contexts/DepositMovementContext.jsx
import React, { createContext, useContext } from 'react';
import { getClientIdByUserId, createDeposit, createMovement } from '../services/deposit.api'; 

const DepositMovementContext = createContext();

export const useDepositMovement = () => {
  return useContext(DepositMovementContext);
};

export const DepositMovementProvider = ({ children }) => {
  const processDepositAndMovement = async (formData) => {
    let depositResult = null;
    let movementResult = null;
    let clientId = null;

    try {
      // Obtener userId desde localStorage
      const userString = localStorage.getItem('user');
      const currentUser = userString ? JSON.parse(userString) : null;

      if (!currentUser || !currentUser._id) {
        throw new Error('No user ID found in local storage. Please log in.');
      }

      const userId = currentUser._id;

      // Obtener clientId desde backend
      clientId = await getClientIdByUserId(userId);
      if (!clientId) {
        throw new Error('No se pudo obtener el client ID.');
      }

      // Preparar datos para depósito
      const depositData = {
        amount: formData.amount,
        currency: formData.currency,
        account: clientId,
        method: formData.method,
        referenceCode: formData.referenceCode,
        initiatedBy: clientId,
      };

      depositResult = await createDeposit(depositData);
      if (depositResult.error) {
        throw new Error(depositResult.message || 'Error al crear el depósito.');
      }

      // Preparar movimiento
      const movementData = {
        client: clientId,
        type: 'deposit',
        amount: formData.amount,
        currency: formData.currency,
        balanceAfter: formData.balanceAfter,
        referenceId: depositResult._id,
        description: formData.description || `Depósito vía ${formData.method}`,
      };
      movementResult = await createMovement(movementData);
      if (movementResult.error) {
        throw new Error(movementResult.message || 'Error al crear el movimiento.');
      }

      return { success: true, deposit: depositResult, movement: movementResult };
    } catch (error) {
      console.error('❌ Error en processDepositAndMovement:', error);
      return { success: false, message: error.message };
    }
  };

  return (
    <DepositMovementContext.Provider value={{ processDepositAndMovement }}>
      {children}
    </DepositMovementContext.Provider>
  );
};
