import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Calendar,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { LinkButton } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Reveal } from '../components/common/Reveal'
import { OrderProgressBar } from '../components/common/OrderProgressBar'
import { ProductImage } from '../components/common/ProductImage'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchOrders, fetchOrder } from '../store/slices/orderSlice'

const STATUS_LABELS = {
  PENDING: 'Awaiting confirmation',
  PLACED: 'Order placed',
  CREATED: 'Order created',
  CONFIRMED: 'Order confirmed',
  PACKED: 'Packed and ready',
  SHIPPED: 'On the way',
  DELIVERED: 'Delivered',
}

export function OrderTrackPage() {
  const dispatch = useAppDispatch()
  const { orders, loading } = useAppSelector((state) => state.orders)
  const [expandedOrders, setExpandedOrders] = useState({})

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  if (loading && (!orders || orders.length === 0)) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary-600" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Reveal className="flex flex-col items-start gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
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
          <LinkButton to="/products" size="lg" className="mt-6">
            Start shopping <ArrowRight className="h-4 w-4 ml-2" />
          </LinkButton>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 space-y-6 max-w-4xl mx-auto"
        >
          {orders.map((order) => {
            const orderId = order.orderId || order.id
            const currentStatus = order.orderStatus || order.orderProgress || 'PLACED'
            const isExpanded = !!expandedOrders[orderId]
            const items = Array.isArray(order.items) ? order.items : []

            return (
              <Card
                key={orderId}
                padded={false}
                className="overflow-hidden hover:border-primary-200 transition-colors shadow-sm"
              >
                {/* Order Header */}
                <div className="p-6 bg-card border-b border-border">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Order ID:
                        </span>
                        <span className="font-mono text-xs font-bold text-foreground">
                          #{orderId}
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline gap-3">
                        <span className="font-display text-2xl font-bold text-foreground">
                          ₹{(order.price ?? order.totalAmount ?? order.total ?? 0).toLocaleString('en-IN')}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          <CreditCard className="w-3 h-3" />
                          {order.paymentMethod || 'COD'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${
                          currentStatus === 'DELIVERED'
                            ? 'text-success border-success-200 bg-success-50 dark:bg-success-950/40'
                            : 'text-primary-700 border-primary-100 bg-primary-50 dark:text-primary-300 dark:border-primary-900 dark:bg-primary-950/40'
                        }`}
                      >
                        {STATUS_LABELS[currentStatus] || currentStatus}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Expected:{' '}
                          <strong className="text-foreground">
                            {order.expectedDeliveryDate || 'Soon'}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Tracker: Highlights according to orderStatus */}
                  <div className="mt-6 pt-4 border-t border-border/60">
                    <OrderProgressBar orderStatus={order.orderStatus} orderProgress={order.orderProgress} />
                  </div>
                </div>

                {/* Products Preview */}
                <div className="p-6 bg-muted/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary-600" />
                      Items in this shipment ({items.length})
                    </h3>
                    <button
                      onClick={() => toggleExpand(orderId)}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>Hide details <ChevronUp className="w-3.5 h-3.5" /></>
                      ) : (
                        <>View items & details <ChevronDown className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>

                  {/* Item List */}
                  <div className="space-y-4">
                    {items.slice(0, isExpanded ? items.length : 2).map((item, idx) => {
                      const prod = item.product || {}
                      const productName = prod.productName || 'Ayurvedic Product'
                      const prodImage = prod.productImage || item.productImage
                      const unitPrice = item.unitPrice ?? prod.productPrice ?? 0
                      const quantity = item.quantity ?? 1

                      return (
                        <div
                          key={item.orderItemId || item.productId || idx}
                          className="flex items-center gap-4 p-3 bg-card rounded-xl border border-border/80 shadow-sm"
                        >
                          <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-border bg-muted">
                            <ProductImage
                              product={{
                                productName,
                                productImage: prodImage,
                              }}
                              className="h-full w-full"
                              imgClassName="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-semibold text-foreground truncate">
                                {productName}
                              </h4>
                              {prod.productCategory && (
                                <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                                  {prod.productCategory}
                                </span>
                              )}
                              {prod.productWeight && (
                                <span className="text-xs text-muted-foreground">
                                  ({prod.productWeight})
                                </span>
                              )}
                            </div>

                            {prod.productDescription && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {prod.productDescription}
                              </p>
                            )}

                            <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Qty: <strong className="text-foreground">{quantity}</strong></span>
                              <span>Price: <strong className="text-foreground">₹{unitPrice.toLocaleString('en-IN')}</strong></span>
                              <span className="font-semibold text-foreground">
                                Total: ₹{(unitPrice * quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {!isExpanded && items.length > 2 && (
                      <p className="text-xs text-center text-muted-foreground pt-1">
                        +{items.length - 2} more item(s)...
                      </p>
                    )}
                  </div>

                  {/* Delivery Status Note */}
                  {order.deliveryDate && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-success font-medium bg-success-50 dark:bg-success-950/30 p-2.5 rounded-lg border border-success-200">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Delivered on: {order.deliveryDate}
                    </div>
                  )}
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
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { order, loading } = useAppSelector((state) => state.orders)

  useEffect(() => {
    if (id) dispatch(fetchOrder(id))
  }, [dispatch, id])

  if (loading || !order) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary-600" />
      </div>
    )
  }

  const items = Array.isArray(order.items) ? order.items : []
  const progress = order.orderProgress || 'PLACED'

  return (
    <div className="container py-10 max-w-3xl">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order #{order.orderId || order.id}</h1>
            <p className="text-sm text-muted-foreground mt-1">Payment: {order.paymentMethod}</p>
          </div>
          <span className="text-xl font-bold text-foreground">
            ₹{(order.price ?? order.totalAmount ?? 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="my-6">
          <OrderProgressBar orderStatus={order.orderStatus} orderProgress={order.orderProgress} />
        </div>

        <div className="space-y-4 mt-6">
          <h2 className="text-lg font-semibold text-foreground">Items</h2>
          {items.map((item, idx) => {
            const prod = item.product || {}
            return (
              <div
                key={item.orderItemId || idx}
                className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl"
              >
                <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0 border border-border">
                  <ProductImage
                    product={{
                      productName: prod.productName,
                      productImage: prod.productImage || item.productImage,
                    }}
                    className="h-full w-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{prod.productName || 'Product'}</h3>
                  <p className="text-xs text-muted-foreground">{prod.productDescription}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Qty: {item.quantity} × ₹{item.unitPrice}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
