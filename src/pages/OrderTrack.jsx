import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Package } from 'lucide-react'
import { LinkButton } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Reveal } from '../components/common/Reveal'
import { OrderProgressBar } from '../components/common/OrderProgressBar'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchOrders } from '../store/slices/orderSlice'

const STATUS_LABELS = {
  PENDING: 'Awaiting confirmation',
  CONFIRMED: 'Order confirmed',
  PACKED: 'Packed and ready',
  SHIPPED: 'On the way',
  DELIVERED: 'Delivered',
}

export function OrderTrackPage() {
  const dispatch = useAppDispatch()
  const { orders, loading } = useAppSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary-600" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Reveal className="flex flex-col items-start gap-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Your orders
        </h1>
        <p className="text-muted-foreground">
          Track every step from placement to delivery. Packaging is always discreet.
        </p>
      </Reveal>

      {orders.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center py-20">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-4">
            <Package className="h-10 w-10" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold text-foreground">No orders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Place your first order and track it here, step by step.
          </p>
          <LinkButton to="/products" size="lg">
            Start shopping <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {orders.map((order) => {
            const progress = order.orderProgress || 'PENDING'
            return (
              <Card
                key={order.id || order.orderId}
                padded={false}
                className="overflow-hidden hover:border-primary-200 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Order #{order.id || order.orderId}
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold text-foreground">
                        ₹{(order.totalAmount ?? order.total ?? 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className="flex h-7 shrink-0 items-center rounded-full border px-2.5 text-xs font-bold">
                      {progress === 'DELIVERED' ? 'text-success border-success-200 bg-success-50' : 'text-primary-600 border-primary-100 bg-primary-50'}
                      {STATUS_LABELS[progress] || progress}
                    </span>
                  </div>
                  <div className="mt-6">
                    <OrderProgressBar orderProgress={progress} />
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Expected <span className="text-foreground">{order.expectedDeliveryDate || '—'}</span>
                  </p>
                </div>
                <div className="border-t border-border p-4">
                  <LinkButton
                    to={`/orders/${order.id || order.orderId}`}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    View details <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                </div>
              </Card>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

export function OrderTrackDetail() {
  return null
}
