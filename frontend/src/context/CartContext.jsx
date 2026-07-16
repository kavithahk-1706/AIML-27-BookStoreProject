import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // NOTE: the API contract confirms GET /cart returns "current user's cart +
  // computed total" inside the standard `data` envelope, but doesn't pin down
  // the exact field names for the cart items array / total. This assumes
  // `data.items` and `data.total` — flag this with the backend person and
  // adjust the two lines below if the real shape differs.
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      setTotal(0)
      return
    }
    setLoading(true)
    try {
      const res = await axiosInstance.get('/cart')
      setItems(res.data.data.items || [])
      setTotal(res.data.data.totalAmount ?? 0)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // POST /cart/items — adds or increments, per contract.
  async function addItem(bookId, quantity = 1) {
    await axiosInstance.post('/cart/items', { bookId, quantity })
    await fetchCart()
  }

  // PUT /cart/items/{itemId}
  async function updateItem(itemId, quantity) {
    await axiosInstance.put(`/cart/items/${itemId}`, { quantity })
    await fetchCart()
  }

  // DELETE /cart/items/{itemId}
  async function removeItem(itemId) {
    await axiosInstance.delete(`/cart/items/${itemId}`)
    await fetchCart()
  }

  // DELETE /cart — clear cart (also called after a successful checkout).
  async function clearCart() {
    await axiosInstance.delete('/cart')
    setItems([])
    setTotal(0)
  }

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0)

  const value = {
    items,
    total,
    itemCount,
    loading,
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}