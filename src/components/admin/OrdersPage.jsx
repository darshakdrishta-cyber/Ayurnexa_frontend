import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Trash2, Package, ShieldCheck, Clock, RotateCcw } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Reveal } from '../../components/common/Reveal'
import { OrderProgressBar } from '../../components/common/OrderProgressBar'
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

  useEffect(() => {
    dispatch(fetchAdminOrdersThunk())
  }, [dispatch])

  const handleProgress = (orderId, next) => {
    dispatch(updateAdminOrderStatusThunk({ orderId, status: next }))
  }

  const nextStep = (current) => {
    const normalized = current === 'PLACED' || current === 'CREATED' ? 'PENDING' : current
    const idx = ORDER_STEPS.indexOf(normalized)
    return idx === -1 || idx >= ORDER_STEPS.length - 1 ? normalized : ORDER_STEPS[idx + 1]
  }

  return (
    <div className="container py-8">
      <Reveal className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Orders</h1>
          <p className="text-muted-foreground">Update order progress as items move through fulfillment.</p>
        </div>
        <Button onClick={() => dispatch(fetchAdminOrdersThunk())} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total orders" value={orders.length} icon={<Package className="w-5 h-5" />} />
        <StatCard
          label="Revenue"
          value={orders.reduce((sum, o) => sum + (o.totalAmount ?? o.total ?? 0), 0)}
          icon={<ShieldCheck className="w-5 h-5" />}
          prefix="₹"
        />
        <StatCard label="Pending" value={orders.filter((o) => o.orderProgress === 'PENDING').length} icon={<Clock className="w-5 h-5" />} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Order ID</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Customer</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Total</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Progress</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary-600" /> Loading orders…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">No orders yet.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const progress = order.orderProgress || 'PENDING'
                  const config = STATUS_CONFIG[progress] || STATUS_CONFIG.PENDING
                  return (
                    <motion.tr
                      key={order.id || order.orderId}
                      whileHover={{ bg: 'muted/30' }}
                      className="border-b border-border group"
                    >
                      <td className="py-4 px-6 text-sm font-medium text-foreground">
                        #{order.id || order.orderId}
                      </td>
                      <td className="py-4 px-6 text-sm text-foreground">
                        {order.customerName || order.user?.email || order.email || 'Customer'}
                      </td>
                      <td className="py-4 px-6 text-sm text-foreground">
                        ₹{(order.totalAmount ?? order.total ?? 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                          config.variant === 'success'
                            ? 'text-success border-success-200 bg-success-50'
                            : config.variant === 'primary'
                            ? 'text-primary-700 border-primary-100 bg-primary-50 dark:text-primary-300 dark:border-primary-900 dark:bg-primary-950'
                            : 'text-secondary-700 border-secondary-200 bg-secondary-50 dark:text-secondary-300 dark:border-secondary-800 dark:bg-secondary-950'
                        }`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <OrderProgressBar orderProgress={progress} className="mb-3" />
                        <div className="flex gap-2">
                          {progress !== 'DELIVERED' && (
                            <button
                              onClick={() => handleProgress(order.id || order.orderId, nextStep(progress))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground text-xs font-semibold transition hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-950 dark:hover:text-primary-300"
                              title={`Mark as ${ORDER_STEP_LABELS[nextStep(progress)]}`}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => dispatch(deleteOrderThunk(order.id || order.orderId))}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-destructive text-xs transition hover:bg-destructive-50"
                            title="Delete order"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
          <p className="text-2xl font-bold text-foreground">{prefix ? prefix + value.toLocaleString('en-IN') : value}</p>
        </div>
        <div className="rounded-lg bg-primary-50 p-3 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
          {icon}
        </div>
      </div>
    </Card>
  )
}
