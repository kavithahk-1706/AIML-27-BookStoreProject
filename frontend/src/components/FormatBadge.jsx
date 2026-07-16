const LABELS = {
  PHYSICAL: 'Physical',
  EBOOK: 'eBook',
  AUDIOBOOK: 'Audiobook',
}

function FormatBadge({ format }) {
  if (!format) return null
  return (
    <span className={`format-badge format-badge--${format.toLowerCase()}`}>
      {LABELS[format] || format}
    </span>
  )
}

export default FormatBadge