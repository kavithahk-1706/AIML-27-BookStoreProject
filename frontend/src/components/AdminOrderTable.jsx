const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

// Assumes each order in GET /admin/orders carries the same top-level fields
// as GET /orders/{id} (status, totalAmount, createdAt), plus possibly a
// nested `order.user` — falls back to `order.userId` if that's not present.
function AdminOrderTable({ orders, onStatusChange, updatingId }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>#{order.id}</td>
            <td>{order.user?.name || `User #${order.userId}`}</td>
            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            <td>₹{Number(order.totalAmount).toFixed(2)}</td>
            <td>
              <select
                value={order.status}
                disabled={updatingId === order.id}
                onChange={(e) => onStatusChange(order.id, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AdminOrderTable