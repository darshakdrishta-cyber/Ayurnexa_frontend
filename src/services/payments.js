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

/**
 * POST /api/payments — create a PayU UPI payment link.
 * Request body: { orderId, amount, paymentMethod: "UPI", idempotencyKey, customerName, customerContact, customerEmail }
 * Response contains paymentLinkUrl and payment record id.
 */
export async function createUpiPayment(
  amountOrPayload,
  maybeIdempotencyKey
) {
  let amount
  let idempotencyKey
  let orderId
  let customerName
  let customerContact
  let customerEmail

  if (
    typeof amountOrPayload === 'object' &&
    amountOrPayload !== null &&
    !Array.isArray(amountOrPayload)
  ) {
    amount = amountOrPayload.amount
    idempotencyKey =
      amountOrPayload.idempotencyKey || newIdempotencyKey('payu')
    orderId = amountOrPayload.orderId
    customerName = amountOrPayload.customerName
    customerContact = amountOrPayload.customerContact
    customerEmail = amountOrPayload.customerEmail
  } else {
    amount = amountOrPayload
    idempotencyKey =
      maybeIdempotencyKey || newIdempotencyKey('payu')
  }

  const { data } = await api.post('/payments', {
    orderId,
    amount: Number(amount),
    paymentMethod: 'UPI',
    idempotencyKey,
    customerName,
    customerContact,
    customerEmail,
  })
  return data
}

/**
 * POST /api/payments/{paymentRecordId}/verify — verify a completed PayU checkout.
 */
export async function verifyPayment(paymentRecordId) {
  const id =
    typeof paymentRecordId === 'object' && paymentRecordId !== null
      ? paymentRecordId.paymentRecordId || paymentRecordId.id || paymentRecordId.paymentId
      : paymentRecordId
  const { data } = await api.post(`/payments/${id}/verify`)
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
