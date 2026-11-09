import api from './api'

let counter = 0

/** Unique idempotency key — reuse it when retrying the same checkout attempt. */
export function newIdempotencyKey(prefix = 'checkout') {
  counter += 1
  return `${prefix}-${Date.now()}-${counter}-${Math.random().toString(36).slice(2, 8)}`
}

/** POST /api/payments — Cash on delivery. */
export async function createCodPayment(amount, idempotencyKey = newIdempotencyKey('cod')) {
  const { data } = await api.post('/payments', { amount, paymentMethod: 'COD', idempotencyKey })
  return data
}

/** POST /api/payments — create a PayU UPI payment link. */
export async function createUpiPayment(amount, idempotencyKey = newIdempotencyKey('upi')) {
  const { data } = await api.post('/payments', {
    amount,
    paymentMethod: 'UPI',
    idempotencyKey,
  })
  return data
}

/** POST /api/payments/{paymentRecordId}/verify — verify a completed PayU checkout. */
export async function verifyPayment(paymentRecordId) {
  const { data } = await api.post(`/payments/${paymentRecordId}/verify`)
  return data
}

/** GET /api/payments — current user's payments. */
export async function listPayments() {
  const { data } = await api.get('/payments')
  return Array.isArray(data) ? data : data?.content || []
}

export async function getPayment(paymentRecordId) {
  const { data } = await api.get(`/payments/${paymentRecordId}`)
  return data
}

export async function updatePayment(paymentRecordId, payload) {
  const { data } = await api.put(`/payments/${paymentRecordId}`, payload)
  return data
}

export async function deletePayment(paymentRecordId) {
  const { data } = await api.delete(`/payments/${paymentRecordId}`)
  return data
}
