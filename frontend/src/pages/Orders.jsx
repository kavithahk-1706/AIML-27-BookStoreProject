import { useEffect, useState } from 'react'
import { getOrders } from '../api/orders'
import OrderCard from '../components/OrderCard'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-state">Loading orders...</div>
  if (error) return <div className="page-state error">Something went wrong loading your orders. Please try again.</div>
  if (orders.length === 0) return <div className="page-state">You haven't placed any orders yet.</div>

  return (
    <div className="page-orders">
      <h1>Your Orders</h1>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

export default Orders