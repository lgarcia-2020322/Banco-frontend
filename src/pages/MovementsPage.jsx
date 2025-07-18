import React, { useEffect } from 'react';
import { useMovements } from '../contexts/MovementContext'; 
import '../styles/movementspage.CSS'; 

const MovementsPage = () => {
  // Consume el contexto de movimientos
  const { movements, loading, error, pagination, updateFiltersAndLoad } = useMovements();

  // Helper para el tipo de movimiento legible
  const getMovementTypeLabel = (type) => {
    const types = {
      deposit: "Depósito",
      withdrawal: "Retiro",
      transfer: "Transferencia",
      purchase: "Compra",
    };
    return types[type] || type;
  };

  // Helper para los iconos de movimiento
  const getMovementIcon = (type) => {
    const icons = {
      deposit: "↗",
      withdrawal: "↙",
      transfer: "↔",
      purchase: "🛒",
    };
    return icons[type] || "•";
  };

  // Helper para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error al formatear fecha:", dateString, e);
      return dateString; // Retorna la cadena original si hay error
    }
  };

  // Helper para formatear el monto
  const formatAmount = (amount, currency) => {
    if (typeof amount !== 'number') return '';
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency || "USD", // Asegura una moneda por defecto
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Renderizado condicional basado en el estado del contexto
  if (loading) {
    return (
      <div className="movements-container">
        <div className="movements-loading">Cargando movimientos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movements-container">
        <div className="movements-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="movements-container">
      <div className="movements-header">
        <h1 className="movements-title">Historial de Movimientos</h1>
        <p className="movements-subtitle">Consulta todos tus movimientos financieros</p>
      </div>

      <div className="movements-table-container">
        <table className="movements-table">
          <thead>
            <tr className="movements-table-header">
              <th className="movements-th">Tipo</th>
              <th className="movements-th">Descripción</th>
              <th className="movements-th">Monto</th>
              <th className="movements-th">Saldo Posterior</th>
              <th className="movements-th">Fecha</th>
              <th className="movements-th">Referencia</th>
            </tr>
          </thead>
          <tbody>
            {movements && movements.length > 0 ? (
              movements.map((movement) => (
                <tr key={movement._id} className="movements-table-row">
                  <td className="movements-td">
                    <div className="movements-type-cell">
                      <span className="movements-type-icon">{getMovementIcon(movement.type)}</span>
                      <span className="movements-type-text">{getMovementTypeLabel(movement.type)}</span>
                    </div>
                  </td>
                  <td className="movements-td">
                    <span className="movements-description">{movement.description}</span>
                  </td>
                  <td className="movements-td">
                    <span
                      className="movements-amount"
                      style={{
                        color:
                          movement.type === "deposit"
                            ? "#00d4aa"
                            : movement.type === "withdrawal" || movement.type === "purchase"
                              ? "#ff6b6b"
                              : "#64b5f6",
                      }}
                    >
                      {movement.type === "deposit" ? "+" : ""}
                      {formatAmount(movement.amount, movement.currency)}
                    </span>
                  </td>
                  <td className="movements-td">
                    <span className="movements-balance">{formatAmount(movement.balanceAfter, movement.currency)}</span>
                  </td>
                  <td className="movements-td">
                    <span className="movements-date">{formatDate(movement.date)}</span>
                  </td>
                  <td className="movements-td">
                    <span className="movements-reference">{movement.referenceId}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="movements-no-data">No se encontraron movimientos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && pagination.total_pages > 1 && (
        <div className="movements-pagination">
          <p className="movements-footer-text">
            Mostrando {movements ? movements.length : 0} movimientos de {pagination.total_records || 0}
          </p>
          <div className="movements-pagination-controls">
            {pagination.prev_page && (
              <button
                className="movements-pagination-button"
                onClick={() => updateFiltersAndLoad({ page: pagination.prev_page })}
              >
                Anterior
              </button>
            )}
            <span className="movements-pagination-info">
              Página {pagination.current_page} de {pagination.total_pages}
            </span>
            {pagination.next_page && (
              <button
                className="movements-pagination-button"
                onClick={() => updateFiltersAndLoad({ page: pagination.next_page })}
              >
                Siguiente
              </button>
            )}
          </div>
        </div>
      )}

      {(!movements || movements.length === 0) && !loading && !error && (
        <div className="movements-footer">
          <p className="movements-footer-text">No hay movimientos recientes</p>
        </div>
      )}
    </div>
  );
};

export default MovementsPage;