import { useState } from 'react'

function SearchBar({ initialValue = '', onSearch }) {
  const [value, setValue] = useState(initialValue)

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Search by title or author..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}

export default SearchBar