import axiosInstance from './axiosInstance'

export async function createOrder(shippingAddress) {
  const res = await axiosInstance.post('/orders', { shippingAddress })
  return res.data.data
}

export async function getOrders() {
  const res = await axiosInstance.get('/orders')
  return res.data.data
}

export async function getOrder(id) {
  const res = await axiosInstance.get(`/orders/${id}`)
  return res.data.data
}

// GET /admin/orders — all orders, paginated (uses the global page/size convention
// from the contract, same as GET /books).
export async function getAdminOrders(params = {}) {
  const res = await axiosInstance.get('/admin/orders', { params })
  return res.data.data
}

// PUT /admin/orders/{id}/status
export async function updateOrderStatus(id, status) {
  const res = await axiosInstance.put(`/admin/orders/${id}/status`, { status })
  return res.data.data
}

// POST /orders/{id}/payment — simulates a payment gateway call (contract 4a).
// Returns 200 with the updated order whether the simulated payment succeeds
// or fails — check order.paymentStatus/order.status in the response to know
// which happened. A genuine error (e.g. 409, order already paid/dead) throws.
export async function processPayment(orderId, paymentDetails) {
  const res = await axiosInstance.post(`/orders/${orderId}/payment`, paymentDetails)
  return res.data.data
}