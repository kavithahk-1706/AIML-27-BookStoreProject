import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder } from '../api/orders'

// Same open assumption flagged elsewhere: assumes the order detail response
// includes an `items` array with nested `item.book` (id, title) alongside
// `item.quantity` and `item.priceAtPurchase`. Confirm real shape with backend.
function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getOrder(id)
      .then(setOrder)
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          setError("You don't have access to this order.")
        } else if (err.response && err.response.status === 404) {
          setError('Order not found.')
        } else {
          setError('Something went wrong loading this order. Please try again.')
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading order...</div>
  if (error) return <div>{error}</div>
  if (!order) return null

  return (
    <div>
      <h1>Order #{order.id}</h1>
      <p className={`order-status order-status--${order.status.toLowerCase()}`}>{order.status}</p>
      <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      <p>Shipping to: {order.shippingAddress}</p>

      <div className="order-items">
        {order.items?.map((item) => (
          <div key={item.id} className="order-item">
            {item.book?.id ? (
              <Link to={`/books/${item.book.id}`}>{item.book.title}</Link>
            ) : (
              <span>{item.book?.title}</span>
            )}
            <span> × {item.quantity}</span>
            <span> — ${Number(item.priceAtPurchase).toFixed(2)} each</span>
          </div>
        ))}
      </div>

      <p>Total: ${Number(order.totalAmount).toFixed(2)}</p>
    </div>
  )
}

export default OrderDetail