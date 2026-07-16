import { useState } from 'react'

function PaymentForm({ onSubmit, submitting }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [validationError, setValidationError] = useState(null)

  function validate() {
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      return 'Card number must be 16 digits.'
    }
    // MM/YY format check
    const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/)
    if (!expiryMatch) {
      return 'Expiry must be in MM/YY format.'
    }
    const month = parseInt(expiryMatch[1], 10)
    const year = parseInt('20' + expiryMatch[2], 10)
    if (month < 1 || month > 12) {
      return 'Expiry month must be between 01 and 12.'
    }
    const now = new Date()
    const expDate = new Date(year, month) // first day of month after expiry
    if (expDate <= now) {
      return 'Card has expired.'
    }
    if (cvv.length !== 3) {
      return 'CVV must be 3 digits.'
    }
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) {
      setValidationError(err)
      return
    }
    setValidationError(null)
    onSubmit({ cardNumber, expiry, cvv })
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      {validationError && <p className="error">{validationError}</p>}
      <label className="form-field">
        Card number
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
          placeholder="1234123412341234"
          maxLength={16}
          required
        />
      </label>
      <label className="form-field">
        Expiry
        <input
          type="text"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          placeholder="MM/YY"
          maxLength={5}
          required
        />
      </label>
      <label className="form-field">
        CVV
        <input
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
          placeholder="123"
          maxLength={3}
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