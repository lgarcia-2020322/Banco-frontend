import api from './api' // Asegúrate de que este 'api' es tu instancia de axios configurada

export const getClientIdByUserId = async (userId) => {
  try {
    const res = await api.get(`/client/getClientByUser/${userId}`);
    if (res.data && res.data.success && res.data.client && res.data.client._id) {
      return res.data.client._id;
    }
    console.warn('No se pudo obtener el ID del cliente para el usuario:', userId, res.data.message);
    return null;
  } catch (err) {
    console.error('Error al obtener el ID del cliente por ID de usuario:', err?.response?.data?.message || err.message);
    return null;
  }
};

export const getAllMovements = async (clientId, params = {}) => {
  if (!clientId) {
    return {
      error: true,
      message: 'Se requiere el ID del cliente para obtener los movimientos.'
    };
  }
  try {
    const res = await api.get('/movement/getAllMovements', { 
      params: { 
        ...params, 
        clientId: clientId // Añadimos el clientId a los parámetros de consulta
      } 
    });
    return res.data;
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al obtener los movimientos'
    };
  }
};

export const getMovementById = async (id, clientId) => {
  if (!clientId) {
    return {
      error: true,
      message: 'Se requiere el ID del cliente para obtener un movimiento específico.'
    };
  }
  try {
    const res = await api.get(`/movement/getMovement/id/${id}`, { params: { clientId: clientId } });
    return res.data;
  } catch (err) {
    return {
      error: true,
      message: err?.response?.data?.message || 'Error al obtener el movimiento'
    }
  }
}
