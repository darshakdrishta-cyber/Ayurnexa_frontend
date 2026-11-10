import api from './api'
import { normalizeOrder } from './orders'

/**
 * Admin API services matching backend admin endpoints:
 * Base URL is configured in api.js (e.g. http://localhost:8080/api)
 */

/**
 * Get User Details by Email (Admin)
 * GET /api/admin/users/by-email?email=user%40example.com
 */
export async function getAdminUserByEmail(email) {
  const { data } = await api.get('/admin/users/by-email', {
    params: { email },
  })
  return data
}

/**
 * Get All Orders (Admin)
 * GET /api/admin/orders
 */
export async function getAdminOrders() {
  const { data } = await api.get('/admin/orders')
  const rawList = Array.isArray(data) ? data : data?.content || []
  return rawList.map(normalizeOrder)
}

/**
 * Get Order Details by Order ID (Admin)
 * GET /api/admin/orders/<ORDER_ID>
 */
export async function getAdminOrderById(orderId) {
  const { data } = await api.get(`/admin/orders/${orderId}`)
  return normalizeOrder(data)
}

/**
 * Update Order Status via Query Param (Admin)
 * PUT /api/admin/order/<ORDER_ID>?status=DELIVERED
 */
export async function updateAdminOrderQuickStatus(orderId, status) {
  const { data } = await api.put(`/admin/order/${orderId}`, null, {
    params: { status },
  })
  return normalizeOrder(data)
}

/**
 * Update Order Status by Order ID with full body (Admin)
 * PUT /api/admin/orders/<ORDER_ID>/status
 */
export async function updateAdminOrderStatus(orderId, payload) {
  const { data } = await api.put(`/admin/orders/${orderId}/status`, payload)
  return normalizeOrder(data)
}

export default {
  getAdminUserByEmail,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderQuickStatus,
  updateAdminOrderStatus,
}

