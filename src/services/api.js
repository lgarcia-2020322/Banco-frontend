// /src/services/api.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5500/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.authorization = token
  }
  return config
})

export default instance
