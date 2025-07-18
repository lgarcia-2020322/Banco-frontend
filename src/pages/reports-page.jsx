// src/pages/DashboardPage.jsx
import React from 'react';
import { useReports } from '../contexts/reports-context.jsx'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Ejemplo con Recharts
import styled from 'styled-components'; // O cualquier otra librería de estilos que uses

// Componentes estilizados
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #282c34; /* Fondo oscuro */
  color: #e0e0e0; /* Texto claro */
  min-height: calc(100vh - 60px); /* Ajusta según tu header/footer */
`;

const WelcomeMessage = styled.h1`
  font-size: 2.5em;
  color: #61dafb; /* Color acento */
  margin-bottom: 30px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.8em;
  color: #90ee90; /* Otro color acento */
  margin-top: 40px;
  margin-bottom: 20px;
  border-bottom: 2px solid #444;
  padding-bottom: 10px;
`;

const ReportCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const ReportCard = styled.div`
  background-color: #3a3f47; /* Color de las tarjetas */
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
`;

const DataList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const DataListItem = styled.li`
  background-color: #444951;
  margin-bottom: 8px;
  padding: 10px 15px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95em;

  span:first-child {
    font-weight: bold;
    color: #b0e0e6;
  }
  span:last-child {
    color: #ffdead;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 1.2em;
  text-align: center;
  margin-top: 50px;
`;

const LoadingMessage = styled.p`
  color: #ffd700;
  font-size: 1.2em;
  text-align: center;
  margin-top: 50px;
`;

const ChartWrapper = styled.div`
  background-color: #3a3f47;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
`;

const DashboardPage = () => {
  const { topClients, totalTransferred, mostPurchasedProducts, loading, error } = useReports();

  if (loading) {
    return <LoadingMessage>Cargando reportes...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <DashboardContainer>
      <WelcomeMessage>Bienvenido al Panel de Administración</WelcomeMessage>

      <SectionTitle>Reportes Generales</SectionTitle>

      <ReportCardContainer>
        <ReportCard>
          <h3>Clientes con Más Movimientos</h3>
          {topClients.length > 0 ? (
            <DataList>
              {topClients.map((client, index) => (
                <DataListItem key={index}>
                  <span>{client.clientName || 'N/A'}</span>
                  <span>Movimientos: {client.movements || 0}</span>
                </DataListItem>
              ))}
            </DataList>
          ) : (
            <p>No hay datos de clientes con movimientos.</p>
          )}
        </ReportCard>

        <ReportCard>
          <h3>Productos Más Comprados</h3>
          {mostPurchasedProducts.length > 0 ? (
            <DataList>
              {mostPurchasedProducts.map((product, index) => (
                <DataListItem key={index}>
                  <span>{product.productName || 'N/A'}</span>
                  <span>Cantidad: {product.totalQuantity || 0}</span>
                </DataListItem>
              ))}
            </DataList>
          ) : (
            <p>No hay datos de productos más comprados.</p>
          )}
        </ReportCard>
      </ReportCardContainer>

      <SectionTitle>Total Transferido por Cliente por Día</SectionTitle>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={totalTransferred}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="date" stroke="#e0e0e0" />
            <YAxis stroke="#e0e0e0" />
            <Tooltip
              contentStyle={{ backgroundColor: '#3a3f47', border: 'none' }}
              itemStyle={{ color: '#e0e0e0' }}
            />
            <Legend wrapperStyle={{ color: '#e0e0e0' }} />
            <Bar dataKey="totalAmount" fill="#8884d8" name="Monto Total Transferido" />
          </BarChart>
        </ResponsiveContainer>
        {totalTransferred.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>No hay datos de transferencias por día.</p>}
      </ChartWrapper>

    </DashboardContainer>
  );
};

export default DashboardPage;