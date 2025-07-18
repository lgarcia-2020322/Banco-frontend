import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react';
import { getClientIdByUserId, getAllMovements } from '../services/movement.api';

export const MovementContext = createContext(null);

export const useMovements = () => useContext(MovementContext);

export const MovementProvider = ({ children }) => {
  const [clientId, setClientId] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({});

  const loadMovementsData = useCallback(
    async (currentFilters = filters, forceReloadClient = false) => {
      setLoading(true);
      setError(null);

      let currentClientId = clientId;

      if (!currentClientId || forceReloadClient) {
        try {
          const userString = localStorage.getItem('user');
          const currentUser = userString ? JSON.parse(userString) : null;

          if (!currentUser || !currentUser._id) {
            throw new Error('No user ID found in local storage. Please log in.');
          }

          const userId = currentUser._id;
          console.log('🔄 Buscando clientId con userId:', userId);

          const fetchedClientId = await getClientIdByUserId(userId);
          if (fetchedClientId) {
            setClientId(fetchedClientId);
            currentClientId = fetchedClientId;
            console.log('✅ clientId obtenido:', fetchedClientId);
          } else {
            throw new Error('No se pudo obtener el client ID.');
          }
        } catch (err) {
          setError(err.message || 'Error al obtener client ID.');
          setLoading(false);
          console.error('❌ Error al obtener clientId:', err);
          return;
        }
      }

      if (currentClientId) {
        try {
          console.log(
            '📦 Cargando movimientos para clientId:',
            currentClientId,
            'con filtros:',
            currentFilters
          );

          const data = await getAllMovements(currentClientId, currentFilters);
          console.log('📥 Respuesta del backend:', data);

          // 🔧 Corrección: usar `data.movements` en lugar de `data.data`
          const allMovementsFromBackend = data.movements || [];

          console.log('✔️ Movimientos totales recibidos:', allMovementsFromBackend.length);
          console.log('🧪 Primer movimiento:', allMovementsFromBackend[0]);

          const filteredMovements = allMovementsFromBackend.filter((mov) => {
            if (!mov.client) return false;

            if (typeof mov.client === 'string') {
              return String(mov.client) === String(currentClientId);
            }

            if (typeof mov.client === 'object' && mov.client._id) {
              return String(mov.client._id) === String(currentClientId);
            }

            return false;
          });

          console.log(
            '✅ Movimientos filtrados por clientId:',
            filteredMovements.length
          );

          setMovements(filteredMovements);
          setPagination(data.pagination || {});
        } catch (err) {
          setError(err.message || 'Error al obtener movimientos.');
          console.error('❌ Excepción al obtener movimientos:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setError('No se encontró client ID después del intento.');
        setLoading(false);
      }
    },
    [clientId, filters]
  );

  useEffect(() => {
    loadMovementsData();
  }, [loadMovementsData]);

  const updateFiltersAndLoad = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const value = {
    clientId,
    movements,
    loading,
    error,
    pagination,
    filters,
    loadMovements: loadMovementsData,
    updateFiltersAndLoad
  };

  return (
    <MovementContext.Provider value={value}>
      {children}
    </MovementContext.Provider>
  );
};
