import { Link } from 'react-router-dom'
import FormatBadge from './FormatBadge'

function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="book-card">
      {book.imageUrl && <img src={book.imageUrl} alt={book.title} />}
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <FormatBadge format={book.format} />
      <p>${Number(book.price).toFixed(2)}</p>
    </Link>
  )
}

export default BookCard