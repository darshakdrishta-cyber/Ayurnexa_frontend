import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
  BadgeIndianRupee,
  CheckCircle2,
  Package,
} from 'lucide-react'
import { Button, LinkButton } from '../components/common/Button'
import { Badge, Card } from '../components/common/Card'
import { Reveal } from '../components/common/Reveal'
import { ProductImage } from '../components/common/ProductImage'
import { useCart } from '../context/CartContext'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { createCodPaymentThunk, newIdempotencyKey } from '../store/slices/paymentSlice'
import { createOrderThunk } from '../store/slices/orderSlice'
import { apiErrorMessage } from '../services/api'

const DELIVERY_FEE = 0

export default function CartPage() {
  const { items, updateQty, remove, clear, subtotal, count } = useCart()
  const { user, token } = useAppSelector((state) => state.auth)
  const isAuthenticated = Boolean(user || token)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const [status, setStatus] = useState({
    state: 'idle',
    message: '',
    orderId: '',
    deliveryDate: '',
  })

  const total = subtotal + DELIVERY_FEE

  const checkout = async () => {
    if (!items.length) return

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    setStatus({ state: 'loading', message: '', orderId: '', deliveryDate: '' })
    const idempotencyKey = newIdempotencyKey('checkout')

    try {
      const payment = await dispatch(
        createCodPaymentThunk({ amount: total, idempotencyKey })
      ).unwrap()

      const paymentId =
        payment?.id || payment?.paymentRecordId || payment?.paymentId || payment?._id
      const expectedDeliveryDate = new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10)

      const order = await dispatch(
        createOrderThunk({
          paymentId,
          expectedDeliveryDate,
          items: items.map((i) => ({ productId: String(i.id), quantity: i.qty })),
        })
      ).unwrap()

      const orderId = order?.orderId || order?.id || order?._id || 'CONFIRMED'
      clear()
      setStatus({
        state: 'success',
        message: `Your order has been confirmed successfully!`,
        orderId: String(orderId),
        deliveryDate: expectedDeliveryDate,
      })
    } catch (error) {
      const msg =
        typeof error === 'string'
          ? error
          : apiErrorMessage(error, 'Checkout failed. Please try again.')
      setStatus({ state: 'error', message: msg, orderId: '', deliveryDate: '' })
    }
  }

  // Order Confirmed Screen
  if (status.state === 'success') {
    return (
      <div className="container max-w-2xl py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-50 text-success dark:bg-success-950/40">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>

          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Thank you for ordering with Ayurnexa. Your wellness formulas are being prepared with
            discreet packaging.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-4 sm:p-6 text-left">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Order ID</span>
                <p className="font-mono text-sm font-bold text-foreground">#{status.orderId}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Estimated Delivery</span>
                <p className="text-sm font-semibold text-foreground">
                  {status.deliveryDate || 'Within 4-5 business days'}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary-600" />
              <span>Shipped in 100% unmarked, discreet tamper-proof packaging.</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/orders')}
              className="gap-2"
            >
              <Package className="h-4 w-4" /> Track my orders
            </Button>
            <LinkButton to="/products" variant="outline" size="lg">
              Continue shopping
            </LinkButton>
          </div>
        </motion.div>
      </div>
    )
  }

  // Empty Bag Screen
  if (!items.length) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950">
          <ShoppingBag className="h-9 w-9" strokeWidth={1.5} />
        </span>
        <h1 className="font-display text-3xl font-semibold text-foreground">Your bag is empty</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Explore our range of authentic Ayurvedic formulas and add your ritual to the bag.
        </p>
        <LinkButton to="/products" size="lg">
          Browse products <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </div>
    )
  }

  return (
    <div className="container py-10 sm:py-14">
      <Reveal>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
        <div className="mt-4 flex items-baseline justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Shopping bag <span className="text-muted-foreground text-2xl font-normal">({count})</span>
          </h1>
          <button
            onClick={clear}
            className="text-xs font-semibold text-muted-foreground hover:text-destructive transition"
          >
            Clear bag
          </button>
        </div>
      </Reveal>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Items List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <Card padded={false} className="flex gap-4 overflow-hidden p-4 sm:p-5">
                  <ProductImage
                    product={item}
                    className="h-24 w-24 shrink-0 rounded-2xl bg-muted sm:h-28 sm:w-28"
                  />
                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          to={`/products/${item.id}`}
                          className="font-display text-base font-semibold text-foreground hover:text-primary-700 transition"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs uppercase tracking-wider text-primary-700 dark:text-primary-400">
                          {item.category} {item.weight ? `· ${item.weight}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="rounded-full p-2 text-muted-foreground transition hover:bg-destructive-50 hover:text-destructive dark:hover:bg-destructive-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 rounded-full border border-border p-1">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition hover:bg-muted"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition hover:bg-muted"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-display text-lg font-semibold text-foreground">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary & Checkout Card */}
        <Reveal delay={0.1}>
          <Card className="sticky top-24">
            <h2 className="font-display text-xl font-semibold text-foreground">Order summary</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({count} items)</span>
                <span className="font-semibold text-foreground">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Discreet delivery</span>
                <span className="font-semibold text-success">Free</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <span className="font-semibold text-foreground">Total amount</span>
                <span className="font-display text-xl font-semibold text-foreground">₹{total}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mt-6 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-secondary-600 dark:text-secondary-400">
                Payment method
              </p>
              {[
                {
                  id: 'COD',
                  icon: Truck,
                  title: 'Cash on delivery',
                  desc: 'Pay cash when package arrives at your doorstep',
                  selected: true,
                },
                {
                  id: 'UPI',
                  icon: BadgeIndianRupee,
                  title: 'UPI / Razorpay',
                  desc: 'Online payments are not available yet',
                  disabled: true,
                  comingSoon: true,
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={opt.disabled}
                  aria-pressed={opt.selected || false}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    opt.selected
                      ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/50'
                      : opt.disabled
                      ? 'cursor-not-allowed border-border opacity-60'
                      : 'border-border hover:border-primary-200 dark:hover:border-primary-800'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      opt.selected
                        ? 'bg-primary-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <opt.icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{opt.title}</span>
                      {opt.comingSoon && <Badge variant="outline">Coming soon</Badge>}
                    </span>
                    <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                  </span>
                  <span
                    className={`h-4 w-4 rounded-full border-2 ${
                      opt.selected
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-border'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Status alerts */}
            {status.state !== 'idle' && status.message && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                  status.state === 'error'
                    ? 'border-destructive/25 bg-destructive-50 text-destructive dark:bg-destructive-950/40'
                    : 'border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-200'
                }`}
              >
                <p>{status.message}</p>
              </motion.div>
            )}

            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={checkout}
              disabled={status.state === 'loading' || !items.length}
            >
              {status.state === 'loading'
                ? 'Processing…'
                : !isAuthenticated
                ? 'Sign in to checkout'
                : `Place order (COD) · ₹${total}`}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary-700" /> Secure checkout · 100% private
              delivery
            </p>
          </Card>
        </Reveal>
      </div>
    </div>
  )
}
