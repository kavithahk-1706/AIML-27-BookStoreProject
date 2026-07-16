// Not in the original component breakdown in frontend_plan.md — added because
// GET /books returns page/totalPages per the API contract, and something has
// to drive that. Flagging this addition explicitly.
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span>
        Page {page + 1} of {totalPages}
      </span>
      <button disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  )
}

export default Pagination