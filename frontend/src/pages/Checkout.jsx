import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../api/orders'
import CheckoutForm from '../components/CheckoutForm'

function Checkout() {
  const { items, total, itemCount, fetchCart } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(shippingAddress) {
    setError(null)
    setSubmitting(true)
    try {
      const order = await createOrder(shippingAddress)
      // POST /orders clears the cart server-side (per contract) — refresh
      // CartContext so the Navbar count / cart page reflect that immediately.
      await fetchCart()
      navigate(`/orders/${order.id}`, { replace: true })
    } catch (err) {
      // Covers stock-check failures (400/409) and other checkout errors from the backend.
      const message = err.response?.data?.message || 'Checkout failed. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (itemCount === 0) {
    return <div>Your cart is empty. Add some books before checking out.</div>
  }

  return (
    <div>
      <h1>Checkout</h1>
      {error && <p className="error">{error}</p>}

      <div className="checkout-summary">
        {items.map((item) => (
          <p key={item.id}>
            {item.book?.title} × {item.quantity}
          </p>
        ))}
        <p>Total: ${Number(total).toFixed(2)}</p>
      </div>

      <CheckoutForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}

export default Checkout