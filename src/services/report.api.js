import apiClient from './api'; 
export const getTopClientsByMovements = async () => {
  try {
    const res = await apiClient.get('/report/topClientsByMovements');
    return res;
  } catch (err) {
    console.error('Error al obtener los clientes con más movimientos:', err);
    return {
      error: true,
      message: err?.response?.data?.message || 'Error inesperado al obtener el reporte de clientes por movimientos.'
    };
  }
};

export const getTotalTransferredByClientPerDay = async () => {
  try {
    const res = await apiClient.get('/report/totalTransferredByClientPerDay');
    return res;
  } catch (err) {
    console.error('Error al obtener el total transferido por cliente por día:', err);
    return {
      error: true,
      message: err?.response?.data?.message || 'Error inesperado al obtener el reporte de transferencias por día.'
    };
  }
};

export const getMostPurchasedProducts = async () => {
  try {
    const res = await apiClient.get('/report/mostPurchasedProducts');
    return res;
  } catch (err) {
    console.error('Error al obtener los productos más comprados:', err);
    return {
      error: true,
      message: err?.response?.data?.message || 'Error inesperado al obtener el reporte de productos más comprados.'
    };
  }
};