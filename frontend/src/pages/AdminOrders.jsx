import { useState, useEffect, useCallback } from 'react'
import { getAdminOrders, updateOrderStatus } from '../api/orders'
import AdminOrderTable from '../components/AdminOrderTable'

const PAGE_SIZE = 20

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchOrders = useCallback(() => {
    setLoading(true)
    getAdminOrders({ page, size: PAGE_SIZE })
      .then((data) => {
        setOrders(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  async function handleStatusChange(orderId, status) {
    setUpdatingId(orderId)
    setError(null)
    try {
      await updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <div className="page-state">Loading orders...</div>

  return (
    <div className="page-admin">
      <h1>Manage Orders</h1>
      {error && <p className="error">{error}</p>}
      <AdminOrderTable orders={orders} onStatusChange={handleStatusChange} updatingId={updatingId} />
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

export default AdminOrders