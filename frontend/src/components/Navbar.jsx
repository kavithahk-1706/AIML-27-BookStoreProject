import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/">Bookstore</Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/cart">Cart ({itemCount})</Link>
            <Link to="/orders">My Orders</Link>
            {/* Trusts AuthContext.isAdmin only, which is derived from /auth/me's role field. */}
            {isAdmin && (
              <>
                <Link to="/admin/books">Manage Books</Link>
                <Link to="/admin/orders">Manage Orders</Link>
              </>
            )}
            <span>{user?.name}</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
