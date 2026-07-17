import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Library, ShoppingCart } from 'lucide-react'
import SearchBar from './SearchBar'

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/', { replace: true, state: {} }) // wipe state so stale `from` can't survive
  }

  // Pulls the current ?search= value only when already on the browse page, so
  // the search box reflects an active search instead of always starting blank.
  // On any other page it just starts empty — submitting still works the same.
  const currentSearch = location.pathname === '/browse'
    ? new URLSearchParams(location.search).get('search') || ''
    : ''

  function handleSearch(value) {
    // Always routes to /browse with the term as a query param — Home.jsx is the
    // only page that reads/acts on `search`, same as before.
    if (value) {
      navigate(`/browse?search=${encodeURIComponent(value)}`)
    } else {
      navigate('/browse')
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Ink in the Clouds</Link>
      <SearchBar initialValue={currentSearch} onSearch={handleSearch} />
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/browse" className="navbar-browse-link">
          <Library size={16} strokeWidth={1.8} />
          Browse
        </Link>
        {isAuthenticated ? (
          <>
            {!isAdmin && (
              <>
                <Link to="/cart" className="navbar-cart-link">
                  <ShoppingCart size={16} strokeWidth={1.8} />
                  Cart {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                </Link>
                <Link to="/orders">My Orders</Link>
              </>
            )}
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