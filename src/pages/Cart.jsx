import { useState, useEffect, useRef, useCallback } from 'react'
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
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { Button, LinkButton } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Reveal } from '../components/common/Reveal'
import { ProductImage } from '../components/common/ProductImage'
import { useCart } from '../context/CartContext'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import {
  createCodPaymentThunk,
  createUpiPaymentThunk,
  verifyPaymentThunk,
  newIdempotencyKey,
} from '../store/slices/paymentSlice'
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
  const [paymentMethod, setPaymentMethod] = useState('UPI')

  const [status, setStatus] = useState({
    state: 'idle', // 'idle' | 'loading' | 'payment_pending' | 'verifying' | 'success' | 'error'
    message: '',
    orderId: '',
    deliveryDate: '',
    paymentRecordId: '',
    paymentLinkUrl: '',
  })

  const itemsRef = useRef(items)
  const statusRef = useRef(status)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  const total = subtotal + DELIVERY_FEE

  const placeOrder = useCallback(async (paymentId, overrideItems) => {
    const orderItems = overrideItems && overrideItems.length ? overrideItems : itemsRef.current
    if (!orderItems.length) {
      throw new Error('Your cart is empty. Please add items to complete checkout.')
    }

    const expectedDeliveryDate = new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10)
    const order = await dispatch(
      createOrderThunk({
        paymentId,
        expectedDeliveryDate,
        items: orderItems.map((i) => ({ productId: String(i.id), quantity: i.qty })),
      })
    ).unwrap()

    const orderId = order?.orderId || order?.id || order?._id || 'CONFIRMED'
    clear()
    try {
      sessionStorage.removeItem('Ayurnexaa_pending_payment')
    } catch {}

    setStatus({
      state: 'success',
      message: 'Your order has been confirmed successfully!',
      orderId: String(orderId),
      deliveryDate: expectedDeliveryDate,
      paymentRecordId: '',
      paymentLinkUrl: '',
    })
  }, [clear, dispatch])

  const verifyCheckoutPayment = useCallback(async (overridePaymentRecordId, overrideItems) => {
    const targetPaymentRecordId = overridePaymentRecordId || statusRef.current.paymentRecordId
    if (!targetPaymentRecordId) return

    setStatus((current) => ({
      ...current,
      state: 'verifying',
      message: 'Contacting PayU to verify your payment status…',
    }))

    try {
      const result = await dispatch(verifyPaymentThunk(targetPaymentRecordId)).unwrap()
      const verifiedPayment = result?.payment || result?.data?.payment || result?.data || result
      const paymentStatus = String(
        verifiedPayment?.status ||
          verifiedPayment?.paymentStatus ||
          result?.status ||
          result?.paymentStatus ||
          ''
      ).toUpperCase()

      const isSuccess =
        ['SUCCESS', 'COMPLETED', 'PAID', 'CAPTURED'].includes(paymentStatus) ||
        result?.verified === true ||
        result?.success === true ||
        verifiedPayment?.verified === true ||
        String(result?.message || '').toLowerCase().includes('success') ||
        String(result?.message || '').toLowerCase().includes('verified')

      if (!isSuccess) {
        const notSuccessMsg =
          ['FAILED', 'FAILURE', 'CANCELLED', 'CANCELED'].includes(paymentStatus)
            ? 'PayU reported this payment was cancelled or failed. Please try checkout again.'
            : 'Payment is not confirmed yet. Complete checkout in PayU, then click verify again.'

        setStatus((current) => ({
          ...current,
          state: 'payment_pending',
          message: notSuccessMsg,
        }))
        return
      }

      await placeOrder(targetPaymentRecordId, overrideItems)
    } catch (error) {
      const msg =
        typeof error === 'string'
          ? error
          : apiErrorMessage(
              error,
              'Payment verification failed. Please ensure you completed payment on PayU and try again.'
            )
      setStatus((current) => ({
        ...current,
        state: 'payment_pending',
        message: msg,
      }))
    }
  }, [dispatch, placeOrder])

  // Check URL params (e.g. redirected back from PayU) or active pending payment in sessionStorage
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const queryPaymentId = searchParams.get('paymentRecordId') || searchParams.get('paymentId')

    if (queryPaymentId && isAuthenticated) {
      let savedItems = itemsRef.current
      try {
        const saved = sessionStorage.getItem('Ayurnexaa_pending_payment')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.items && parsed.items.length) {
            savedItems = parsed.items
          }
        }
      } catch {}

      verifyCheckoutPayment(queryPaymentId, savedItems)
      return
    }

    try {
      const saved = sessionStorage.getItem('Ayurnexaa_pending_payment')
      if (saved && statusRef.current.state === 'idle') {
        const parsed = JSON.parse(saved)
        if (parsed.paymentRecordId && Date.now() - (parsed.createdAt || 0) < 3600000) {
          setStatus({
            state: 'payment_pending',
            message: 'You have a pending PayU payment. Verify it once payment is completed.',
            orderId: '',
            deliveryDate: '',
            paymentRecordId: String(parsed.paymentRecordId),
            paymentLinkUrl: parsed.paymentLinkUrl || '',
          })
        }
      }
    } catch {}
  }, [location.search, isAuthenticated, verifyCheckoutPayment])

  const cancelPendingPayment = () => {
    try {
      sessionStorage.removeItem('Ayurnexaa_pending_payment')
    } catch {}
    setStatus({
      state: 'idle',
      message: '',
      orderId: '',
      deliveryDate: '',
      paymentRecordId: '',
      paymentLinkUrl: '',
    })
  }

  const checkout = async () => {
    if (!items.length) return

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    setStatus({ state: 'loading', message: '', orderId: '', deliveryDate: '' })
    const idempotencyKey = newIdempotencyKey('checkout')

    try {
      if (paymentMethod === 'UPI') {
        // Create PayU payment link: POST /api/payments
        const orderId = `order-${Date.now()}`
        const customerName = user?.username || user?.name || user?.email?.split('@')[0] || 'Customer'
        const customerContact = user?.phone || user?.mobile || ''
        const customerEmail = user?.email || ''

        // Create PayU payment link: POST /api/payments { orderId, amount, paymentMethod: 'UPI', idempotencyKey, customerName, customerContact, customerEmail }
        const payment = await dispatch(
          createUpiPaymentThunk({
            amount: total,
            idempotencyKey,
            orderId,
            customerName,
            customerContact,
            customerEmail,
          })
        ).unwrap()
        const paymentRecordId =
          payment?.id || payment?.paymentRecordId || payment?.paymentId || payment?._id
        const paymentLinkUrl = payment?.paymentLinkUrl || payment?.paymentUrl || payment?.url

        if (!paymentRecordId || !paymentLinkUrl) {
          throw new Error('PayU did not return a valid payment link and payment record ID.')
        }

        let parsedPaymentLink
        try {
          parsedPaymentLink = new URL(paymentLinkUrl)
        } catch {
          throw new Error('PayU returned an invalid payment link URL.')
        }
        if (parsedPaymentLink.protocol !== 'https:' && parsedPaymentLink.protocol !== 'http:') {
          throw new Error('PayU returned an unsupported payment link protocol.')
        }

        // Open PayU payment interface in a new tab
        try {
          window.open(parsedPaymentLink.href, '_blank', 'noopener,noreferrer')
        } catch {
          // Popup blocked — fall back to same-tab navigation
          window.location.href = parsedPaymentLink.href
        }

        // Save in sessionStorage so user can verify if redirected or on page reload
        try {
          sessionStorage.setItem(
            'Ayurnexaa_pending_payment',
            JSON.stringify({
              paymentRecordId: String(paymentRecordId),
              paymentLinkUrl: parsedPaymentLink.href,
              idempotencyKey,
              items: items.map((i) => ({ id: String(i.id), qty: i.qty })),
              total,
              createdAt: Date.now(),
            })
          )
        } catch {}

        setStatus({
          state: 'payment_pending',
          message:
            'PayU payment link has been opened. Complete your payment on PayU, then click "Verify payment" below.',
          orderId: String(orderId),
          deliveryDate: '',
          paymentRecordId: String(paymentRecordId),
          paymentLinkUrl: parsedPaymentLink.href,
          idempotencyKey,
        })
        return
      }

      // COD payment flow
      const payment = await dispatch(
        createCodPaymentThunk({ amount: total, idempotencyKey })
      ).unwrap()
      const paymentId =
        payment?.id || payment?.paymentRecordId || payment?.paymentId || payment?._id
      if (!paymentId) throw new Error('Payment record was not returned.')
      await placeOrder(paymentId)
    } catch (error) {
      const msg =
        typeof error === 'string'
          ? error
          : apiErrorMessage(error, 'Checkout failed. Please try again.')
      setStatus({
        state: 'error',
        message: msg,
        orderId: '',
        deliveryDate: '',
        paymentRecordId: '',
        paymentLinkUrl: '',
      })
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
            Thank you for ordering with Ayurnexaa. Your wellness formulas are being prepared with
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

  // Empty Bag Screen (only when not in payment pending state)
  if (!items.length && status.state !== 'payment_pending' && status.state !== 'verifying') {
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
          {items.length > 0 && status.state !== 'payment_pending' && status.state !== 'verifying' && (
            <button
              onClick={clear}
              className="text-xs font-semibold text-muted-foreground hover:text-destructive transition"
            >
              Clear bag
            </button>
          )}
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
                      {status.state !== 'payment_pending' && status.state !== 'verifying' && (
                        <button
                          onClick={() => remove(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="rounded-full p-2 text-muted-foreground transition hover:bg-destructive-50 hover:text-destructive dark:hover:bg-destructive-950/40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 rounded-full border border-border p-1">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          disabled={status.state === 'payment_pending' || status.state === 'verifying'}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition hover:bg-muted disabled:opacity-50"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          disabled={status.state === 'payment_pending' || status.state === 'verifying'}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-foreground transition hover:bg-muted disabled:opacity-50"
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
                  id: 'UPI',
                  icon: BadgeIndianRupee,
                  title: 'PayU (UPI / NetBanking / Cards)',
                  desc: 'Pay securely online via PayU payment gateway',
                },
                {
                  id: 'COD',
                  icon: Truck,
                  title: 'Cash on delivery',
                  desc: 'Pay cash when package arrives at your doorstep',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={
                    status.state === 'loading' ||
                    status.state === 'verifying' ||
                    status.state === 'payment_pending'
                  }
                  onClick={() => setPaymentMethod(opt.id)}
                  aria-pressed={paymentMethod === opt.id}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    paymentMethod === opt.id
                      ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/50'
                      : 'border-border hover:border-primary-200 dark:hover:border-primary-800'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      paymentMethod === opt.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <opt.icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-foreground">{opt.title}</span>
                    <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                  </span>
                  <span
                    className={`h-4 w-4 rounded-full border-2 ${
                      paymentMethod === opt.id
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

            {/* Action buttons depending on state */}
            {status.state === 'payment_pending' || status.state === 'verifying' ? (
              <div className="mt-5 space-y-3">
                {status.paymentLinkUrl && (
                  <div className="flex flex-col gap-2">
                    <a
                      href={status.paymentLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-4 text-sm font-bold text-primary-800 transition hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-200 dark:hover:bg-primary-900"
                    >
                      🚀 Open PayU Payment Interface <ExternalLink className="h-4 w-4" />
                    </a>
                    <p className="text-xs text-muted-foreground">
                      If the PayU window did not open, click the button above to open it manually.
                    </p>
                  </div>
                )}
                <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                  <div className="flex justify-between mb-1">
                    <span>Order ID:</span>
                    <span className="font-mono text-xs">{status.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idempotency Key:</span>
                    <span className="font-mono text-xs">{status.idempotencyKey}</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => verifyCheckoutPayment()}
                  disabled={status.state === 'verifying'}
                >
                  {status.state === 'verifying' ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Verifying payment…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> I’ve paid — Verify payment
                    </>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={cancelPendingPayment}
                  disabled={status.state === 'verifying'}
                  className="w-full text-center text-xs font-semibold text-muted-foreground transition hover:text-destructive py-1"
                >
                  Cancel and choose another payment method
                </button>
              </div>
            ) : (
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
                    : paymentMethod === 'COD'
                      ? `Place order (COD) · ₹${total}`
                      : `Pay with PayU · ₹${total}`}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

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
