import { useState, useEffect } from 'react'
import { getCategories } from '../api/categories'

const FORMATS = ['PHYSICAL', 'EBOOK', 'AUDIOBOOK']

function AdminBookForm({ initialBook, onSubmit, submitting, onCancel }) {
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

  const isPhysical = form.format === 'PHYSICAL'

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      title: form.title,
      author: form.author,
      isbn: form.isbn,
      description: form.description,
      price: Number(form.price),
      // don't send stockQuantity for digital — backend ignores it anyway
      // but contract says don't require it, so we just omit it entirely
      stockQuantity: isPhysical ? Number(form.stockQuantity) : undefined,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      imageUrl: form.imageUrl || null,
      format: form.format,
      fileUrl: isPhysical ? null : form.fileUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="admin-book-form">
      <label className="form-field">
        Title
        <input value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
      </label>
      <label className="form-field">
        Author
        <input value={form.author} onChange={(e) => handleChange('author', e.target.value)} required />
      </label>
      <label className="form-field">
        ISBN
        <input value={form.isbn} onChange={(e) => handleChange('isbn', e.target.value)} />
      </label>
      <label className="form-field">
        Description
        <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
      </label>
      <label className="form-field">
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

      {/* stock quantity is meaningless for licenses — hide it entirely for digital formats */}
      {isPhysical && (
        <label className="form-field">
          Stock quantity
          <input
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={(e) => handleChange('stockQuantity', e.target.value)}
            required
          />
        </label>
      )}

      <label className="form-field">
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
      <label className="form-field">
        Image URL
        <input value={form.imageUrl} onChange={(e) => handleChange('imageUrl', e.target.value)} />
      </label>
      <label className="form-field">
        Format
        <select value={form.format} onChange={(e) => handleChange('format', e.target.value)}>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>
      {!isPhysical && (
        <label className="form-field">
          File URL
          <input value={form.fileUrl} onChange={(e) => handleChange('fileUrl', e.target.value)} required />
        </label>
      )}
      <div className="admin-book-form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : initialBook ? 'Update book' : 'Create book'}
        </button>
        {onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  )
}

export default AdminBookForm