import api from './api'
import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderQuickStatus,
  updateAdminOrderStatus,
} from './admin'

/**
 * Normalizes an order from /api/orders or /api/admin/orders.
 * Supports the clean user structure:
 * {
 *   orderId,
 *   paymentMethod,
 *   orderStatus,
 *   orderProgress,
 *   price,
 *   expectedDeliveryDate,
 *   deliveryDate,
 *   items: [
 *     {
 *       orderItemId,
 *       productId,
 *       quantity,
 *       unitPrice,
 *       rating,
 *       feedback,
 *       product: {
 *         productId,
 *         productName,
 *         productDescription,
 *         productCategory,
 *         productWeight,
 *         productType,
 *         productImage,
 *         productPrice
 *       }
 *     }
 *   ]
 * }
 */
export function normalizeOrder(order) {
  if (!order || typeof order !== 'object') return order

  const rawItems = Array.isArray(order.items) ? order.items : []

  const items = rawItems.map((item) => {
    const rawProd = item.product || item.productDetails || {}
    const productImage =
      item.productImage ||
      rawProd.productImage ||
      rawProd.image ||
      rawProd.imageUrl ||
      null

    return {
      orderItemId: item.orderItemId || item.id,
      productId: item.productId || rawProd.productId || rawProd.id,
      quantity: item.quantity ?? 1,
      unitPrice: item.unitPrice ?? rawProd.productPrice ?? rawProd.price ?? 0,
      rating: item.rating ?? null,
      feedback: item.feedback ?? null,
      product: {
        productId: rawProd.productId || rawProd.id || item.productId,
        productName: rawProd.productName || rawProd.name || 'Ayurvedic Formulation',
        productDescription:
          rawProd.productDescription || rawProd.desc || rawProd.description || '',
        productCategory: rawProd.productCategory || rawProd.category || 'Ayurveda',
        productWeight: rawProd.productWeight || rawProd.weight || '',
        productType: rawProd.productType || rawProd.type || '',
        productImage,
        productPrice: rawProd.productPrice ?? rawProd.price ?? item.unitPrice ?? 0,
      },
    }
  })

  return {
    orderId: order.orderId || order.id,
    id: order.orderId || order.id,
    paymentMethod: order.paymentMethod || 'COD',
    orderStatus: order.orderStatus || 'CREATED',
    orderProgress: order.orderProgress || 'PLACED',
    price: order.price ?? order.totalAmount ?? order.total ?? 0,
    totalAmount: order.price ?? order.totalAmount ?? order.total ?? 0,
    expectedDeliveryDate: order.expectedDeliveryDate || null,
    deliveryDate: order.deliveryDate || null,
    active: order.active ?? true,
    user: order.user || null,
    createdAt: order.createdAt || null,
    updatedAt: order.updatedAt || null,
    items,
  }
}

/**
 * POST /api/orders — requires a saved Payment:
 * paymentMethod === 'COD' or payment.status === 'SUCCESS'
 */
export async function createOrder({ paymentId, items, expectedDeliveryDate }) {
  const { data } = await api.post('/orders', { paymentId, items, expectedDeliveryDate })
  return normalizeOrder(data)
}

/**
 * GET /api/orders — retrieves current user's orders
 */
export async function listOrders() {
  const { data } = await api.get('/orders')
  const rawList = Array.isArray(data) ? data : data?.content || []
  return rawList.map(normalizeOrder)
}

/**
 * GET /api/orders/{orderId} — retrieves single user order
 */
export async function getOrder(orderId) {
  const { data } = await api.get(`/orders/${orderId}`)
  return normalizeOrder(data)
}

/** PUT /api/orders/{orderId} */
export async function updateOrder(orderId, payload) {
  const { data } = await api.put(`/orders/${orderId}`, payload)
  return normalizeOrder(data)
}

export async function deleteOrder(orderId) {
  const { data } = await api.delete(`/orders/${orderId}`)
  return data
}

// Re-export admin order helpers
export {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderQuickStatus,
  updateAdminOrderStatus,
}
