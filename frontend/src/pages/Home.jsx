import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBooks } from '../api/books'
import BookGrid from '../components/BookGrid'
import CategoryFilter from '../components/CategoryFilter'
import Pagination from '../components/Pagination'
import FormatFilter from '../components/FormatFilter'

const PAGE_SIZE = 20

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const page = Number(searchParams.get('page') || 0)
  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const format = searchParams.get('format') || ''
  
  function fetchBooks() {
    setLoading(true)
    setError(false)
    getBooks({
      page,
      size: PAGE_SIZE,
      search: search || undefined,
      categoryId: categoryId || undefined,
      format: format || undefined,
    })
      .then((data) => {
        setBooks(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchBooks() }, [page, search, categoryId, format])

  function updateParams(next) {
    const merged = { search, categoryId, format, page: 0, ...next }
    const cleaned = {}
    if (merged.search) cleaned.search = merged.search
    if (merged.categoryId) cleaned.categoryId = merged.categoryId
    if (merged.format) cleaned.format = merged.format
    if (merged.page) cleaned.page = String(merged.page)
    setSearchParams(cleaned)
  }

  return (
    <div>
      <CategoryFilter selectedCategoryId={categoryId} onChange={(id) => updateParams({ categoryId: id, page: 0 })} />
      <FormatFilter selectedFormat={format} onChange={(f) => updateParams({ format: f, page: 0 })} />
      <BookGrid books={books} loading={loading} error={error} onRetry={fetchBooks} />
      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams({ page: p })} />
    </div>
  )
}

export default Home