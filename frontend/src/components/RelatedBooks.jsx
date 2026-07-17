import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBooks } from '../api/books'
import FormatBadge from './FormatBadge'

function RelatedBooks({ currentBookId, categoryId, categoryName }) {
  const [books, setBooks] = useState([])

  useEffect(() => {
    if (!categoryId) return
    getBooks({ categoryId, size: 8, page: 0 })
      .then((data) => {
        // exclude the book we're currently on
        setBooks(data.content.filter((b) => b.id !== currentBookId))
      })
      .catch(() => {}) // silently fail — carousel is non-critical
  }, [currentBookId, categoryId])

  if (books.length === 0) return null

  return (
    <div className="related-books">
      <h2 className="related-books-title">
        More in {categoryName || 'this category'}
      </h2>
      <div className="related-books-track">
        {books.map((book) => (
          <Link to={`/books/${book.id}`} key={book.id} className="related-book-card">
            {book.imageUrl ? (
              <img src={book.imageUrl} alt={book.title} />
            ) : (
              <div className="related-book-card--empty" />
            )}
            <div className="related-book-info">
              <p className="related-book-title">{book.title}</p>
              <p className="related-book-author">{book.author}</p>
              <FormatBadge format={book.format} />
              <p className="related-book-price">₹{Number(book.price).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedBooks