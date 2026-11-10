import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  Trash2,
  Package,
  ShieldCheck,
  Clock,
  RotateCcw,
  User,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Calendar,
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Reveal } from '../../components/common/Reveal'
import { OrderProgressBar } from '../../components/common/OrderProgressBar'
import { ProductImage } from '../../components/common/ProductImage'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import {
  fetchAdminOrdersThunk,
  updateAdminOrderStatusThunk,
  deleteOrderThunk,
  ORDER_STEPS,
  ORDER_STEP_LABELS,
} from '../../store/slices/orderSlice'

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  PLACED: { label: 'Placed', variant: 'secondary' },
  CREATED: { label: 'Created', variant: 'secondary' },
  CONFIRMED: { label: 'Confirmed', variant: 'primary' },
  PACKED: { label: 'Packed', variant: 'primary' },
  SHIPPED: { label: 'Shipped', variant: 'primary' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
}

export function AdminOrders() {
  const dispatch = useAppDispatch()
  const { orders, loading } = useAppSelector((state) => state.orders)
  const [expandedRow, setExpandedRow] = useState(null)

  useEffect(() => {
    dispatch(fetchAdminOrdersThunk())
  }, [dispatch])

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateAdminOrderStatusThunk({ orderId, status: newStatus }))
  }

  const normalizeStep = (current) => {
    if (current === 'PLACED' || current === 'CREATED') return 'PENDING'
    return current
  }

  // Forward step
  const nextStep = (current) => {
    const step = normalizeStep(current)
    const idx = ORDER_STEPS.indexOf(step)
    return idx === -1 || idx >= ORDER_STEPS.length - 1 ? step : ORDER_STEPS[idx + 1]
  }

  // Back step
  const prevStep = (current) => {
    const step = normalizeStep(current)
    const idx = ORDER_STEPS.indexOf(step)
    return idx <= 0 ? ORDER_STEPS[0] : ORDER_STEPS[idx - 1]
  }

  const toggleRow = (orderId) => {
    setExpandedRow((prev) => (prev === orderId ? null : orderId))
  }

  return (
    <div className="container py-8">
      <Reveal className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage order progress forward or backward through fulfillment.</p>
        </div>
        <Button onClick={() => dispatch(fetchAdminOrdersThunk())} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total orders" value={orders.length} icon={<Package className="w-5 h-5" />} />
        <StatCard
          label="Revenue"
          value={orders.reduce((sum, o) => sum + (o.price ?? o.totalAmount ?? o.total ?? 0), 0)}
          icon={<ShieldCheck className="w-5 h-5" />}
          prefix="₹"
        />
        <StatCard
          label="Pending / Placed"
          value={
            orders.filter(
              (o) =>
                o.orderProgress === 'PENDING' ||
                o.orderProgress === 'PLACED' ||
                o.orderStatus === 'CREATED'
            ).length
          }
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Order ID</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Customer</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Items / Details</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Total</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Progress</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground text-right">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary-600 inline-block mr-2" />
                    Loading admin orders…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const orderId = order.orderId || order.id
                  const progress = order.orderProgress || order.orderStatus || 'PENDING'
                  const config = STATUS_CONFIG[progress] || STATUS_CONFIG.PENDING
                  const isExpanded = expandedRow === orderId
                  const items = Array.isArray(order.items) ? order.items : []
                  const user = order.user || {}
                  const customerName =
                    user.username ||
                    order.customerName ||
                    user.email ||
                    order.email ||
                    'Customer'

                  const canGoBack = normalizeStep(progress) !== 'PENDING'
                  const canGoForward = progress !== 'DELIVERED'

                  return (
                    <motion.tr
                      key={orderId}
                      className="border-b border-border group"
                    >
                      <td colSpan={6} className="p-0">
                        {/* Summary Row */}
                        <div className="flex flex-wrap md:flex-nowrap items-center py-4 px-6 hover:bg-muted/30 transition-colors">
                          {/* Order ID */}
                          <div className="w-full md:w-1/6 font-mono text-xs font-semibold text-foreground truncate pr-2">
                            #{orderId}
                          </div>

                          {/* Customer */}
                          <div className="w-full md:w-1/6 text-sm text-foreground pr-2">
                            <div className="flex items-center gap-1.5 font-medium">
                              <User className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="truncate">{customerName}</span>
                            </div>
                            {user.email && (
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            )}
                          </div>

                          {/* Items Preview & Toggle */}
                          <div className="w-full md:w-1/6 text-sm pr-2">
                            <button
                              onClick={() => toggleRow(orderId)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 dark:bg-primary-950 px-2.5 py-1 rounded-md"
                            >
                              <Package className="w-3.5 h-3.5" />
                              {items.length} {items.length === 1 ? 'item' : 'items'}
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3 ml-0.5" />
                              ) : (
                                <ChevronDown className="w-3 h-3 ml-0.5" />
                              )}
                            </button>
                          </div>

                          {/* Total */}
                          <div className="w-full md:w-1/6 text-sm font-semibold text-foreground pr-2">
                            ₹{(order.price ?? order.totalAmount ?? order.total ?? 0).toLocaleString('en-IN')}
                            <span className="block text-[11px] font-normal text-muted-foreground">
                              {order.paymentMethod || 'COD'}
                            </span>
                          </div>

                          {/* Progress Badge & Bar */}
                          <div className="w-full md:w-1/4 pr-4">
                            <div className="flex items-center justify-between mb-1.5">
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${
                                  config.variant === 'success'
                                    ? 'text-success border-success-200 bg-success-50'
                                    : config.variant === 'primary'
                                    ? 'text-primary-700 border-primary-100 bg-primary-50 dark:text-primary-300 dark:border-primary-900 dark:bg-primary-950'
                                    : 'text-secondary-700 border-secondary-200 bg-secondary-50 dark:text-secondary-300 dark:border-secondary-800 dark:bg-secondary-950'
                                }`}
                              >
                                {config.label}
                              </span>
                            </div>
                            <OrderProgressBar orderStatus={order.orderStatus} orderProgress={order.orderProgress} />
                          </div>

                          {/* Back & Next Actions */}
                          <div className="w-full md:w-1/6 flex items-center justify-end gap-1.5 pt-2 md:pt-0">
                            {/* Back Button */}
                            <button
                              onClick={() => handleStatusChange(orderId, prevStep(progress))}
                              disabled={!canGoBack}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                                canGoBack
                                  ? 'border-border bg-card text-foreground hover:bg-muted hover:text-foreground cursor-pointer'
                                  : 'border-border/40 text-muted-foreground/40 cursor-not-allowed opacity-40'
                              }`}
                              title={
                                canGoBack
                                  ? `Move back to ${ORDER_STEP_LABELS[prevStep(progress)] || prevStep(progress)}`
                                  : 'Already at initial status'
                              }
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>

                            {/* Forward Button */}
                            <button
                              onClick={() => handleStatusChange(orderId, nextStep(progress))}
                              disabled={!canGoForward}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                                canGoForward
                                  ? 'border-border bg-card text-foreground hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-300 cursor-pointer'
                                  : 'border-border/40 text-muted-foreground/40 cursor-not-allowed opacity-40'
                              }`}
                              title={
                                canGoForward
                                  ? `Advance to ${ORDER_STEP_LABELS[nextStep(progress)] || nextStep(progress)}`
                                  : 'Already Delivered'
                              }
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>

                            {/* Delete Order */}
                            <button
                              onClick={() => dispatch(deleteOrderThunk(orderId))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-destructive text-xs transition hover:bg-destructive-50 cursor-pointer"
                              title="Delete order"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Details Drawer */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-muted/30 border-t border-border px-6 py-4"
                            >
                              <div className="text-xs text-muted-foreground flex flex-wrap gap-4 mb-3">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" /> Expected Delivery:{' '}
                                  <strong className="text-foreground">{order.expectedDeliveryDate || 'N/A'}</strong>
                                </span>
                                {order.deliveryDate && (
                                  <span className="flex items-center gap-1 text-success">
                                    Delivered on: <strong>{order.deliveryDate}</strong>
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <CreditCard className="w-3.5 h-3.5" /> Payment Method:{' '}
                                  <strong className="text-foreground">{order.paymentMethod || 'COD'}</strong>
                                </span>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                                {items.map((item, idx) => {
                                  const prod = item.product || {}
                                  const prodImage = prod.productImage || item.productImage
                                  return (
                                    <div
                                      key={item.orderItemId || idx}
                                      className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card shadow-xs"
                                    >
                                      <div className="h-12 w-12 rounded overflow-hidden shrink-0 border border-border bg-muted">
                                        <ProductImage
                                          product={{
                                            productName: prod.productName,
                                            productImage: prodImage,
                                          }}
                                          className="h-full w-full"
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-foreground truncate">
                                          {prod.productName || 'Product'}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground truncate">
                                          {prod.productCategory} {prod.productWeight && `• ${prod.productWeight}`}
                                        </p>
                                        <p className="text-[11px] font-medium text-foreground mt-0.5">
                                          Qty: {item.quantity} × ₹{item.unitPrice} = ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function StatCard({ label, value, icon, prefix }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">
            {prefix ? prefix + value.toLocaleString('en-IN') : value}
          </p>
        </div>
        <div className="rounded-lg bg-primary-50 p-3 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
          {icon}
        </div>
      </div>
    </Card>
  )
}
