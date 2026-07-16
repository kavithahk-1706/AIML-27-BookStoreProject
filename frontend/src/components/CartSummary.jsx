import { Link } from 'react-router-dom'

function CartSummary({ total, itemCount }) {
  return (
    <div className="cart-summary">
      <p>
        {itemCount} item{itemCount === 1 ? '' : 's'}
      </p>
      <p>Total: ₹{Number(total).toFixed(2)}</p>
      <Link to="/checkout">
        <button disabled={itemCount === 0}>Proceed to checkout</button>
      </Link>
    </div>
  )
}

export default CartSummary