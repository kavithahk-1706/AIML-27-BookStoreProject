import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap any route element that needs auth:
//   <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
// Wrap any admin-only route with adminOnly:
//   <Route path="/admin/books" element={<ProtectedRoute adminOnly><AdminBooks /></ProtectedRoute>} />
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Still checking localStorage / GET /auth/me on first load — don't redirect yet.
  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // adminOnly gate trusts only AuthContext's isAdmin, which is derived from
  // /auth/me's role field — no separate "is admin" logic per frontend_plan.md.
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute