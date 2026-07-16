import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBook, downloadBook } from '../api/books'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import FormatBadge from '../components/FormatBadge'

function BookDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
    getBook(id)
      .then(setBook)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  // No separate "did the user buy this" check against order history here —
  // the backend already gates on CONFIRMED/DELIVERED order status, and a second
  // independent frontend check risks drifting out of sync with that logic.
  // We just call the endpoint and handle the 403 gracefully.
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
      if (err.response && err.response.status === 403) {
        setDownloadError('You need to purchase this book before you can download it.')
      } else {
        setDownloadError('Something went wrong. Please try again.')
      }
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error || !book) return <div>Book not found.</div>

  const isDigital = book.format === 'EBOOK' || book.format === 'AUDIOBOOK'

  return (
    <div>
      {book.imageUrl && <img src={book.imageUrl} alt={book.title} />}
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      <FormatBadge format={book.format} />
      <p>${Number(book.price).toFixed(2)}</p>
      <p>{book.description}</p>
      <p>{book.stockQuantity > 0 ? `${book.stockQuantity} in stock` : 'Out of stock'}</p>

      <button onClick={() => addItem(book.id, 1)} disabled={book.stockQuantity <= 0}>
        Add to cart
      </button>

      {isDigital && isAuthenticated && (
        <div>
          <button onClick={handleDownload} disabled={downloading}>
            {downloading ? 'Preparing...' : book.format === 'AUDIOBOOK' ? 'Listen' : 'Download'}
          </button>
          {downloadError && <p className="error">{downloadError}</p>}
        </div>
      )}
    </div>
  )
}

export default BookDetail