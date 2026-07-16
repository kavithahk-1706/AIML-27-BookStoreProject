import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'

function Cart() {
  const { items, total, itemCount, loading, updateItem, removeItem } = useCart()
  
  const hasStockIssue = items.some(
      item => item.quantity > (item.book?.stockQuantity || Infinity)
  )

  if (loading) return <div className="page-state">Loading cart...</div>

  if (items.length === 0) {
    return <div className="page-state">Your cart is empty.</div>
  }

  return (
    <div className="page-cart">
      <h1>Your Cart</h1>
      {hasStockIssue && (
        <p className="error">
          One or more items exceed available stock. Please adjust quantities before checkout.
        </p>
      )}

      {items.map((item) => (
        <CartItem key={item.id} item={item} onUpdateQuantity={updateItem} onRemove={removeItem} />
      ))}
    <CartSummary total={total} itemCount={itemCount} hasStockIssue={hasStockIssue} />    </div>
  )
}

export default Cart