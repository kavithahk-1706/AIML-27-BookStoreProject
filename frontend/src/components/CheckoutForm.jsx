import { useState } from 'react'

function CheckoutForm({ onSubmit, submitting }) {
  const [shippingAddress, setShippingAddress] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(shippingAddress)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Shipping address
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Placing order...' : 'Place order'}
      </button>
    </form>
  )
}

export default CheckoutForm