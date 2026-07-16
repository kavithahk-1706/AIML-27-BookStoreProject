import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
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

  // Pulls the current ?search= value only when already on the home page, so
  // the search box reflects an active search instead of always starting blank.
  // On any other page it just starts empty — submitting still works the same.
  const currentSearch = location.pathname === '/'
    ? new URLSearchParams(location.search).get('search') || ''
    : ''

  function handleSearch(value) {
    // Always routes to Home with the term as a query param — Home.jsx is the
    // only page that reads/acts on `search`, same as before, just triggered
    // from a persistent spot instead of a page-local one.
    if (value) {
      navigate(`/?search=${encodeURIComponent(value)}`)
    } else {
      navigate('/')
    }
  }

  return (
    <nav className="navbar">
      <Link to="/">Bookstore</Link>
      <SearchBar initialValue={currentSearch} onSearch={handleSearch} />
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            {!isAdmin && (
              <>
                <Link to="/cart">Cart ({itemCount})</Link>
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