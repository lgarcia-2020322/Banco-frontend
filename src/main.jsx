import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UsersProvider } from './contexts/UsersContext' // ✅ AÑADIR ESTO

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UsersProvider> {/* ✅ ENVOLVER APP */}
          <App />
        </UsersProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
