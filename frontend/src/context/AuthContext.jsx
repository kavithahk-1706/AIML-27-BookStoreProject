import { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  // true while we're checking localStorage / calling GET /auth/me on first load
  const [loading, setLoading] = useState(true)

  // On app load: if a token exists in localStorage, rehydrate the user via
  // GET /auth/me (handles page refresh). If that call fails (expired/invalid
  // token), drop it and treat the user as logged out.
  useEffect(() => {
    const existingToken = localStorage.getItem('token')
    if (!existingToken) {
      setLoading(false)
      return
    }

    axiosInstance
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.data)
        setToken(existingToken)
      })
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  // POST /auth/login -> { data: { token, user } }
  async function login(email, password) {
    const res = await axiosInstance.post('/auth/login', { email, password })
    const { token: newToken, user: loggedInUser } = res.data.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(loggedInUser)
    return loggedInUser
  }

  // Never persist the password anywhere here — only the token and user object
  // returned by the backend are stored.
  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  // PUT /auth/me -> { data: { token, user } }, same shape as login.
  // Always overwrites token + user on success — no branching on what changed.
  async function updateProfile(name, email, currentPassword, newPassword) {
    const payload = { name, email, currentPassword }
    if (newPassword) payload.newPassword = newPassword // omit key entirely if blank

    const res = await axiosInstance.put('/auth/me', payload)
    const { token: newToken, user: updatedUser } = res.data.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(updatedUser)
    return updatedUser
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    logout,
    updateProfile, // <-- add this line
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}



export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

