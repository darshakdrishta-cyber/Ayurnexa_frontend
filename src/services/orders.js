import api from './api'

/**
 * POST /api/orders — requires a saved Payment:
 * paymentMethod === 'COD' or payment.status === 'SUCCESS' (UPI confirmed by webhook).
 * Prices/totals are always recomputed server-side from the catalog.
 */
export async function createOrder({ paymentId, items, expectedDeliveryDate }) {
  const { data } = await api.post('/orders', { paymentId, items, expectedDeliveryDate })
  return data
}

export async function listOrders() {
  const { data } = await api.get('/orders')
  return Array.isArray(data) ? data : data?.content || []
}

export async function getOrder(orderId) {
  const { data } = await api.get(`/orders/${orderId}`)
  return data
}

/** PUT /api/orders/{orderId} — update status/progress/dates (e.g. orderProgress: 'PACKED'). */
export async function updateOrder(orderId, payload) {
  const { data } = await api.put(`/orders/${orderId}`, payload)
  return data
}

export async function deleteOrder(orderId) {
  const { data } = await api.delete(`/orders/${orderId}`)
  return data
}
