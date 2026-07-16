import { useState, useEffect, useCallback } from 'react'
import { getBooks, createBook, updateBook, deleteBook } from '../api/books'
import AdminBookForm from '../components/AdminBookForm'
import FormatBadge from '../components/FormatBadge'

const PAGE_SIZE = 20

function AdminBooks() {
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingBook, setEditingBook] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchBooks = useCallback(() => {
    setLoading(true)
    getBooks({ page, size: PAGE_SIZE })
      .then((data) => {
        setBooks(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => setError('Failed to load books.'))
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  async function handleSubmit(payload) {
    setSubmitting(true)
    setError(null)
    try {
      if (editingBook === 'new') {
        await createBook(payload)
      } else {
        await updateBook(editingBook.id, payload)
      }
      setEditingBook(null)
      fetchBooks()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this book?')) return
    setError(null)
    try {
      await deleteBook(id)
      fetchBooks()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book.')
    }
  }

  if (editingBook) {
    return (
      <div className="page-admin">
        <h1>{editingBook === 'new' ? 'Add Book' : 'Edit Book'}</h1>
        {error && <p className="error">{error}</p>}
        <AdminBookForm
          initialBook={editingBook === 'new' ? null : editingBook}
          onSubmit={handleSubmit}
          submitting={submitting}
          onCancel={() => setEditingBook(null)}
        />
      </div>
    )
  }

  return (
    <div className="page-admin">
      <h1>Manage Books</h1>
      {error && <p className="error">{error}</p>}
      <button onClick={() => setEditingBook('new')}>Add Book</button>

      {loading ? (
        <div>Loading books...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Format</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <FormatBadge format={book.format} />
                </td>
                <td>₹{Number(book.price).toFixed(2)}</td>
                <td>{book.stockQuantity}</td>
                <td>
                  <button onClick={() => setEditingBook(book)}>Edit</button>
                  <button onClick={() => handleDelete(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span>
          Page {page + 1} of {totalPages || 1}
        </span>
        <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}

export default AdminBooks