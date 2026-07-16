import { useEffect, useState } from 'react'
import { getCategories } from '../api/categories'

function CategoryFilter({ selectedCategoryId, onChange }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  return (
    <select value={selectedCategoryId || ''} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">All categories</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  )
}

export default CategoryFilter