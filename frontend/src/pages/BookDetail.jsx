import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getBook, downloadBook, getPurchaseStatus } from '../api/books'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import FormatBadge from '../components/FormatBadge'

function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isAdmin } = useAuth()
  const { addItem } = useCart()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)
  const [purchased, setPurchased] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setPurchased(false)
    getBook(id)
      .then((fetchedBook) => {
        setBook(fetchedBook)
        const isDigital = fetchedBook.format === 'EBOOK' || fetchedBook.format === 'AUDIOBOOK'
        if (isAuthenticated && isDigital) {
          return getPurchaseStatus(id).then((res) => setPurchased(res.purchased))
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id, isAuthenticated])

  function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }
    addItem(book.id, 1)
  }

  async function handleDownload() {
    setDownloading(true)
    setDownloadError(null)
    try {
      const res = await downloadBook(id)
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = book.title
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      if (err.response?.status === 403) {
        setDownloadError('You need to purchase this book before you can download it.')
      } else {
        setDownloadError('Something went wrong. Please try again.')
      }
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return <div className="page-state">Loading...</div>
  if (error || !book) return <div className="page-state">Book not found.</div>

  const isDigital = book.format === 'EBOOK' || book.format === 'AUDIOBOOK'

  return (
    <div className="page-book-detail">
      {/* Left column: cover image */}
      <div className="book-detail-cover">
        {book.imageUrl
          ? <img src={book.imageUrl} alt={book.title} />
          : <div className="book-detail-cover--empty" />}
      </div>

      {/* Right column: all details */}
      <div className="book-detail-info">
        <h1>{book.title}</h1>
        <p className="book-detail-author">{book.author}</p>
        <FormatBadge format={book.format} />
        <p className="book-detail-price">₹{Number(book.price).toFixed(2)}</p>
        <p className="book-detail-description">{book.description}</p>

        {/* stock display only makes sense for physical books */}
        {!isDigital && (
          <span className={book.stockQuantity > 0 ? 'stock-pill stock-pill--in' : 'stock-pill stock-pill--out'}>
            {book.stockQuantity > 0 ? `${book.stockQuantity} in stock` : 'Out of stock'}
          </span>
        )}

        <div className="book-detail-actions">
          {isAdmin ? (
            <button
              className="btn-primary"
              onClick={() => navigate('/admin/books', { state: { editBookId: book.id } })}
            >
              Edit Book
            </button>
          ) : isDigital && purchased ? (
            // already owns it — show read/listen, never add to cart
            <>
              <button className="btn-secondary" onClick={handleDownload} disabled={downloading}>
                {downloading ? 'Preparing...' : book.format === 'AUDIOBOOK' ? 'Listen' : 'Read'}
              </button>
              {downloadError && <p className="error">{downloadError}</p>}
            </>
          ) : (
            // physical, or digital not yet purchased — show add to cart
            <button
              className="btn-primary"
              onClick={handleAddToCart}
              disabled={!isDigital && book.stockQuantity <= 0}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetail