// Same open assumption as CartContext: assumes each cart item carries a
// nested `item.book` object (id, title, author, price, imageUrl) alongside
// `item.id` (cart item id) and `item.quantity`. Confirm real shape with backend.
function CartItem({ item, onUpdateQuantity, onRemove }) {
  const book = item.book

  return (
    <div className="cart-item">
      {book?.imageUrl && <img src={book.imageUrl} alt={book.title} />}
      <div className="cart-item-details">
        <h4>{book?.title}</h4>
        <p>{book?.author}</p>
        <p>${Number(book?.price ?? 0).toFixed(2)}</p>
      </div>
      <label className="cart-item-quantity">
        Qty
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => {
            const qty = Number(e.target.value)
            if (qty >= 1) onUpdateQuantity(item.id, qty)
          }}
        />
      </label>
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  )
}

export default CartItem