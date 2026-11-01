import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Check,
} from 'lucide-react'
import { Button, LinkButton } from '../common/Button'
import { Badge, Card } from '../common/Card'
import { ProductImage } from '../common/ProductImage'
import { useCart } from '../../context/CartContext'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchProduct, clearProduct } from '../../store/slices/productSlice'
import { CATEGORY_LABEL } from '../../data/products'

export function ProductDetail() {
  const dispatch = useAppDispatch()
  const { add } = useCart()
  const { id } = useParams()
  const { product: apiProduct, loading } = useAppSelector((state) => state.products)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id))
    }
    return () => {
      dispatch(clearProduct())
    }
  }, [dispatch, id])

  const rawProduct = apiProduct

  const product = rawProduct
    ? {
        id: rawProduct.productId || rawProduct.id || id,
        name: rawProduct.productName || rawProduct.name || 'Product',
        desc: rawProduct.productDescription || rawProduct.description || rawProduct.desc || '',
        price: Number(rawProduct.productPrice ?? rawProduct.price ?? 0) || 0,
        category: rawProduct.productCategory || rawProduct.category || 'wellness',
        rating: rawProduct.rating || 4.8,
        reviews: rawProduct.reviews || 128,
        image: rawProduct.productImage || rawProduct.image,
        tag: rawProduct.isActive === false ? 'Inactive' : rawProduct.tag,
        weight: rawProduct.productWeight || rawProduct.weight,
        form: rawProduct.form,
      }
    : null

  const handleAddToCart = () => {
    if (!product) return
    add(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  if (loading && !product) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-28 text-center">
        <p className="font-display text-3xl font-semibold text-foreground">Product not found</p>
        <LinkButton to="/products" className="mt-6">
          Browse the catalogue
        </LinkButton>
      </div>
    )
  }

  const perks = [
    { icon: Truck, text: 'Discreet packaging' },
    { icon: ShieldCheck, text: 'Batch tested, quality assured' },
    { icon: RotateCcw, text: '7-day easy returns' },
  ]

  return (
    <div className="container py-10 sm:py-14">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All products
      </Link>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-8">
          <ProductImage
            product={product}
            className="aspect-square w-full rounded-2xl bg-muted"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5"
        >
          <Badge variant="primary" className="w-fit">
            {CATEGORY_LABEL[product.category] || product.category}
          </Badge>
          <h1 className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          {product.weight && (
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {product.weight} {product.form ? `· ${product.form}` : ''}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary-400 text-secondary-400" />
              ))}
            </span>
            <span className="font-bold text-foreground">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">{product.desc}</p>

          <div className="flex items-baseline gap-3 border-t border-border pt-5">
            <span className="font-display text-4xl font-semibold text-foreground">
              ₹{product.price}
            </span>
            <span className="text-sm text-muted-foreground">Inclusive of all taxes</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-border p-1.5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-7 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity"
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              onClick={handleAddToCart}
              className={`flex-1 sm:flex-none sm:px-8 transition-colors ${
                added ? 'bg-success hover:bg-success/90 text-white' : ''
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to bag
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to bag
                </>
              )}
            </Button>
            <LinkButton
              to="/cart"
              size="lg"
              variant="outline"
              className="flex-1 sm:flex-none sm:px-8"
            >
              Go to bag
            </LinkButton>
          </div>

          <ul className="grid gap-3 border-t border-border pt-6 sm:grid-cols-3">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Icon className="h-4.5 w-4.5 shrink-0 text-primary-700 dark:text-primary-400" />
                {text}
              </li>
            ))}
          </ul>

          <Card className="bg-muted/60">
            <p className="text-sm font-semibold text-foreground">How to use</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Follow the dosage on the label, preferably after meals, or as directed by your
              physician. Store in a cool, dry place away from direct sunlight.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
