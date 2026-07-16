import { Link } from 'react-router-dom'

// Same open assumption as the cart shape: assumes GET /orders items include
// id, status, totalAmount, createdAt. Confirm real field names with backend.
function OrderCard({ order }) {
  return (
    <Link to={`/orders/${order.id}`} className="order-card">
      <span>Order #{order.id}</span>
      <span className={`order-status order-status--${order.status.toLowerCase()}`}>{order.status}</span>
      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
      <span>${Number(order.totalAmount).toFixed(2)}</span>
    </Link>
  )
}

export default OrderCard