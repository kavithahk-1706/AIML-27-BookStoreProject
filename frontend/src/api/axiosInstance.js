import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Attaches the JWT from localStorage to every outgoing request, per
// frontend_plan.md's auth flow. AuthContext stores the token under
// the key 'token' — this has to match.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance