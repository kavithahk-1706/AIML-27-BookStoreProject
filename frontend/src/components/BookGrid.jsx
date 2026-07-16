import BookCard from './BookCard'

function BookGrid({ books, loading, error, onRetry }) {
  if (loading) return <div className="page-state">Loading books...</div>
  if (error) return (
    <div className="page-state" style={{ flexDirection: 'column', gap: '1rem' }}>
      <span>Something went wrong loading books.</span>
      {onRetry && (
        <button className="btn-secondary" onClick={onRetry}>Try again</button>
      )}
    </div>
  )
  if (!books || books.length === 0) return <div className="page-state">No books found.</div>

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

export default BookGrid