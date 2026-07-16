import BookCard from './BookCard'

function BookGrid({ books, loading, error }) {
  if (loading) return <div>Loading books...</div>
  if (error) return <div>Something went wrong loading books. Please try again.</div>
  if (!books || books.length === 0) return <div>No books found.</div>

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

export default BookGrid