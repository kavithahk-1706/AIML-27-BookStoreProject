import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

function Landing() {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <p className="landing-eyebrow">Welcome to</p>
        <h1 className="landing-wordmark">Ink in the Clouds</h1>
        <p className="landing-tagline">
          A curated library of physical books, eBooks, and audiobooks —<br />
          wherever your imagination drifts.
        </p>
        <Link to="/browse" className="landing-cta">
          <BookOpen size={20} strokeWidth={1.8} />
          Browse Books
        </Link>
      </div>
      <div className="landing-orbs" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
    </div>
  )
}

export default Landing
