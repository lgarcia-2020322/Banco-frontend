import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UsersProvider } from './contexts/UsersContext' 
import { ClientsProvider } from './contexts/ClientsContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { ProductsProvider } from './contexts/ProductsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UsersProvider>
          <ClientsProvider>
            <FavoritesProvider>
              <ProductsProvider>
                <App />
              </ProductsProvider>
            </FavoritesProvider>
          </ClientsProvider>
        </UsersProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
