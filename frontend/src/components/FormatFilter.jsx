const FORMATS = [
  { value: '', label: 'All formats' },
  { value: 'PHYSICAL', label: 'Physical' },
  { value: 'EBOOK', label: 'eBook' },
  { value: 'AUDIOBOOK', label: 'Audiobook' },
]

function FormatFilter({ selectedFormat, onChange }) {
  return (
    <select value={selectedFormat || ''} onChange={(e) => onChange(e.target.value || null)}>
      {FORMATS.map((f) => (
        <option key={f.value} value={f.value}>
          {f.label}
        </option>
      ))}
    </select>
  )
}

export default FormatFilter