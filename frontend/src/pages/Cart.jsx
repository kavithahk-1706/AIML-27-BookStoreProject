import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'

function Cart() {
  const { items, total, itemCount, loading, updateItem, removeItem } = useCart()

  if (loading) return <div>Loading cart...</div>

  if (items.length === 0) {
    return <div>Your cart is empty.</div>
  }

  return (
    <div>
      <h1>Your Cart</h1>
      {items.map((item) => (
        <CartItem key={item.id} item={item} onUpdateQuantity={updateItem} onRemove={removeItem} />
      ))}
      <CartSummary total={total} itemCount={itemCount} />
    </div>
  )
}

export default Cart