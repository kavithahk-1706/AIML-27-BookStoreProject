import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder, processPayment } from '../api/orders'
import CheckoutForm from '../components/CheckoutForm'
import PaymentForm from '../components/PaymentForm'

function Checkout() {
  const { items, total, itemCount, fetchCart } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  // null = still on the shipping-address step. Once POST /orders succeeds we
  // hold onto the created order and move to the payment step — same page,
  // no new route, same pattern AdminBooks.jsx uses for its edit/list toggle.
  const [pendingOrder, setPendingOrder] = useState(null)

  async function handlePlaceOrder(shippingAddress) {
    setError(null)
    setSubmitting(true)
    try {
      const order = await createOrder(shippingAddress)
      // POST /orders clears the cart server-side (per contract) — refresh
      // CartContext so the Navbar count / cart page reflect that immediately.
      await fetchCart()
      setPendingOrder(order)
    } catch (err) {
      // Covers stock-check failures (400) and other checkout errors from the backend.
      const message = err.response?.data?.message || 'Checkout failed. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handlePay(paymentDetails) {
    setError(null)
    setSubmitting(true)
    try {
      const order = await processPayment(pendingOrder.id, paymentDetails)
      // Both a successful and a "declined" simulated payment return 200 —
      // the order's own status/paymentStatus tells the story, so either way
      // we just go to the order detail page and let it render that state.
      navigate(`/orders/${order.id}`, { replace: true })
    } catch (err) {
      // Covers 409 (order no longer payable) and other payment errors.
      const message = err.response?.data?.message || 'Payment failed. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (pendingOrder) {
    return (
      <div className="page-checkout">
        <h1>Payment</h1>
        <p>Order #{pendingOrder.id} — ₹{Number(pendingOrder.totalAmount).toFixed(2)}</p>
        {error && <p className="error">{error}</p>}
        <PaymentForm onSubmit={handlePay} submitting={submitting} />
      </div>
    )
  }

  if (itemCount === 0) {
    return <div className="page-state">Your cart is empty. Add some books before checking out.</div>
  }

  const allDigital = items.length > 0 && items.every(
    (item) => item.book?.format === 'EBOOK' || item.book?.format === 'AUDIOBOOK'
  )

  return (
    <div className="page-checkout">
      <h1>Checkout</h1>
      {error && <p className="error">{error}</p>}

      <div className="checkout-summary">
        {items.map((item) => (
          <p key={item.id}>
            {item.book?.title} × {item.quantity}
          </p>
        ))}
        <p>Total: ₹{Number(total).toFixed(2)}</p>
      </div>

      <CheckoutForm onSubmit={handlePlaceOrder} submitting={submitting} allDigital={allDigital} />
    </div>
  )
}

export default Checkout;