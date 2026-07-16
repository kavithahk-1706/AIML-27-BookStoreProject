import { useState, useEffect } from 'react'
import { getCategories } from '../api/categories'

const FORMATS = ['PHYSICAL', 'EBOOK', 'AUDIOBOOK']

// initialBook = null means "create" mode; passing a book means "edit" mode.
function AdminBookForm({ initialBook, onSubmit, submitting }) {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: initialBook?.title || '',
    author: initialBook?.author || '',
    isbn: initialBook?.isbn || '',
    description: initialBook?.description || '',
    price: initialBook?.price ?? '',
    stockQuantity: initialBook?.stockQuantity ?? '',
    categoryId: initialBook?.categoryId ?? '',
    imageUrl: initialBook?.imageUrl || '',
    format: initialBook?.format || 'PHYSICAL',
    fileUrl: initialBook?.fileUrl || '',
  })

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      title: form.title,
      author: form.author,
      isbn: form.isbn,
      description: form.description,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      imageUrl: form.imageUrl || null,
      format: form.format,
      fileUrl: form.format === 'PHYSICAL' ? null : form.fileUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
      </label>
      <label>
        Author
        <input value={form.author} onChange={(e) => handleChange('author', e.target.value)} required />
      </label>
      <label>
        ISBN
        <input value={form.isbn} onChange={(e) => handleChange('isbn', e.target.value)} />
      </label>
      <label>
        Description
        <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
      </label>
      <label>
        Price
        <input
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => handleChange('price', e.target.value)}
          required
        />
      </label>
      <label>
        Stock quantity
        <input
          type="number"
          min="0"
          value={form.stockQuantity}
          onChange={(e) => handleChange('stockQuantity', e.target.value)}
          required
        />
      </label>
      <label>
        Category
        <select value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} required>
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Image URL
        <input value={form.imageUrl} onChange={(e) => handleChange('imageUrl', e.target.value)} />
      </label>
      <label>
        Format
        <select value={form.format} onChange={(e) => handleChange('format', e.target.value)}>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>
      {form.format !== 'PHYSICAL' && (
        <label>
          File URL
          <input value={form.fileUrl} onChange={(e) => handleChange('fileUrl', e.target.value)} required />
        </label>
      )}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : initialBook ? 'Update book' : 'Create book'}
      </button>
    </form>
  )
}

export default AdminBookForm