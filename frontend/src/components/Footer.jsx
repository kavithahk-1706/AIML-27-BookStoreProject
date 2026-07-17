import { Link } from 'react-router-dom'
import { BookOpen, Heart } from 'lucide-react'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <BookOpen size={20} strokeWidth={1.6} />
          <span>Ink in the Clouds</span>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/browse">Browse</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/login">Sign in</Link>
        </nav>

        <p className="footer-copy">
          © {year} Ink in the Clouds. Made with{' '}
          <Heart size={12} strokeWidth={2} className="footer-heart" />{' '}
          for book lovers.
        </p>
      </div>
    </footer>
  )
}

export default Footer
