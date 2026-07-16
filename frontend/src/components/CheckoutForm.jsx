import { useState } from 'react'

// allDigital = true means every item in the cart is EBOOK or AUDIOBOOK —
// no shipping address needed or shown in that case.
function CheckoutForm({ onSubmit, submitting, allDigital }) {
  const [shippingAddress, setShippingAddress] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // pass empty string for digital-only orders — backend field isn't
    // @NotBlank so this goes through fine, and it's meaningless anyway
   onSubmit(allDigital ? 'N/A - Digital Order' : shippingAddress)
  }

  return (
    <form onSubmit={handleSubmit}>
      {!allDigital && (
        <label>
          Shipping address
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
          />
        </label>
      )}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Placing order...' : 'Place order'}
      </button>
    </form>
  )
}

export default CheckoutForm