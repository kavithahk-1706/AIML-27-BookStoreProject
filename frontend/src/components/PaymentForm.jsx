import { useState } from 'react'

function PaymentForm({ onSubmit, submitting }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ cardNumber, expiry, cvv })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card number
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="4242 4242 4242 4242"
          required
        />
      </label>
      <label>
        Expiry
        <input
          type="text"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          placeholder="MM/YY"
          required
        />
      </label>
      <label>
        CVV
        <input
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="123"
          required
        />
      </label>
      <p>This is a simulated payment step — no real charge is made, and card details are never stored.</p>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Processing payment...' : 'Pay now'}
      </button>
    </form>
  )
}

export default PaymentForm