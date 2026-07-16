function CartItem({ item, onUpdateQuantity, onRemove }) {
  const book = item.book
  const isDigital = book?.format === 'EBOOK' || book?.format === 'AUDIOBOOK'

  return (
    <div className="cart-item">
      {book?.imageUrl && <img src={book.imageUrl} alt={book.title} />}
      <div className="cart-item-details">
        <h4>{book?.title}</h4>
        <p>{book?.author}</p>
        <p>₹{Number(book?.price ?? 0).toFixed(2)}</p>
      </div>

      {isDigital ? (
        // quantity is locked at 1 for licenses — no stepper, no illusion of choice
        <span className="cart-item-quantity">Qty: 1</span>
      ) : (
        <label className="cart-item-quantity">
          Qty
          <input
            type="number"
            min="1"
            max={item.book?.stockQuantity}
            value={item.quantity}
            onChange={(e) => {
              const qty = Number(e.target.value)
              if (qty >= 1) onUpdateQuantity(item.id, qty)
            }}
          />
        </label>
      )}

      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  )
}

export default CartItem