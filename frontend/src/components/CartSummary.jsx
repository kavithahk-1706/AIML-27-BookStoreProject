import { useNavigate } from 'react-router-dom'

function CartSummary({ total, itemCount, hasStockIssue }) {
  const navigate = useNavigate()

  return (
    <div className="cart-summary">
      <p className="cart-summary-count">{itemCount} item{itemCount === 1 ? '' : 's'}</p>
      <p className="cart-summary-total">Total: ₹{Number(total).toFixed(2)}</p>
      <button
        disabled={itemCount === 0 || hasStockIssue}
        onClick={() => navigate('/checkout')}
      >
        Proceed to checkout
      </button>
    </div>
  )
}

export default CartSummary