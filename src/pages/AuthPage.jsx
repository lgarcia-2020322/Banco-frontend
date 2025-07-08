// /src/pages/Auth/AuthPage.jsx
import { useState } from 'react'
import { Login } from '../components/Login'
import { Register } from '../components/Register'
import '../styles/auth.css'

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true)

  const switchAuthHandler = () => setShowLogin(!showLogin)

  return (
    <div className="auth-container"> {/* Aquí está el contenedor centrado */}
      {showLogin
        ? <Login switchAuthHandler={switchAuthHandler} />
        : <Register switchAuthHandler={switchAuthHandler} />}
    </div>
  )
}

export default AuthPage
