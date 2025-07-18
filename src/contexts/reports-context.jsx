// src/context/ReportContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getTopClientsByMovements, getTotalTransferredByClientPerDay, getMostPurchasedProducts } from '../services/report.api'; // Asegúrate de que la ruta sea correcta

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [topClients, setTopClients] = useState([]);
  const [totalTransferred, setTotalTransferred] = useState([]);
  const [mostPurchasedProducts, setMostPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        clientsRes,
        transferredRes,
        productsRes
      ] = await Promise.all([
        getTopClientsByMovements(),
        getTotalTransferredByClientPerDay(),
        getMostPurchasedProducts()
      ]);

      if (clientsRes.error) {
        throw new Error(clientsRes.message);
      }
      setTopClients(clientsRes.data || []); // Asume que la respuesta exitosa tiene una propiedad 'data'

      if (transferredRes.error) {
        throw new Error(transferredRes.message);
      }
      setTotalTransferred(transferredRes.data || []);

      if (productsRes.error) {
        throw new Error(productsRes.message);
      }
      setMostPurchasedProducts(productsRes.data || []);

    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Error al cargar los reportes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <ReportContext.Provider
      value={{
        topClients,
        totalTransferred,
        mostPurchasedProducts,
        loading,
        error,
        fetchReports // Para poder refrescar los datos si es necesario
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};