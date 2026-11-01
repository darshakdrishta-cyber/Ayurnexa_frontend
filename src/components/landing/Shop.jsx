import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Plus, Star, ArrowRight } from 'lucide-react'
import { Button, LinkButton } from '../common/Button'
import { Badge } from '../common/Card'
import { Reveal, SectionHeading } from '../common/Reveal'
import { ProductImage } from '../common/ProductImage'
import { CATEGORY_LABEL, PRODUCTS } from '../../data/products'
import { useCart } from '../../context/CartContext'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchProducts } from '../../store/slices/productSlice'

export function ProductCard({ product, compact = false }) {
  const { add, items } = useCart()
  const [added, setAdded] = useState(false)
  const productId = String(product?.id || product?.productId || '')
  const inCart = items.some((i) => String(i.id) === productId)

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    add(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_1px_2px_rgb(14_21_18/0.04)] transition-colors hover:border-primary-200 dark:hover:border-primary-800"
    >
      <Link to={`/products/${product.id}`} className="flex h-full flex-col focus-visible:outline-none">
        <div className="relative overflow-hidden bg-muted">
          <ProductImage
            product={product}
            className={`w-full transition-transform duration-700 group-hover:scale-[1.06] ${compact ? 'aspect-square' : 'aspect-4/3'}`}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {product.tag && (
            <Badge variant="secondary" className="absolute left-3 top-3 shadow-sm">
              {product.tag}
            </Badge>
          )}
          <div className="absolute inset-x-3 bottom-3 hidden justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex sm:translate-y-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary-800 shadow-lg backdrop-blur">
              View details <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary-600 dark:text-primary-400">
              {CATEGORY_LABEL[product.category]}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-secondary-400 text-secondary-400" />
              {product.rating}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary-700 dark:group-hover:text-primary-300">
            {product.name}
          </h3>
          {!compact && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.desc}</p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            <span className="font-display text-xl font-semibold text-foreground">
              ₹{product.price}
            </span>
            <Button
              size="sm"
              variant={added ? 'secondary' : 'outline'}
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className={added ? 'text-white' : ''}
            >
              {added || inCart ? (
                <>
                  <Check className="h-4 w-4" /> Added
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/** All products grid fetched from the API. */
export function Shop() {
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const productSource = products && products.length > 0 ? products : (!loading ? PRODUCTS : [])
  const visible = productSource.map((product) => ({
    id: product.productId || product.id,
    name: product.productName || product.name || 'Product',
    desc: product.productDescription || product.description || product.desc || '',
    price: Number(product.productPrice ?? product.price ?? 0) || 0,
    category: product.productCategory || product.category || 'wellness',
    rating: product.rating || 4.7,
    reviews: product.reviews || 0,
    image: product.productImage || product.image,
    tag: product.isActive === false ? 'Inactive' : product.tag,
  }))

  return (
    <section id="shop" className="container scroll-mt-24 py-20 sm:py-24">
      <SectionHeading
        eyebrow="The apothecary"
        title="All products"
        description="Formulas for energy, stamina and confidence — batch-tested, discreetly delivered."
      />

      {loading && visible.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary-600 mb-3" />
          <p className="text-sm text-muted-foreground">Loading catalogue…</p>
        </div>
      )}

      {visible.length > 0 && (
        <motion.div layout className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28, delay: Math.min(i * 0.04, 0.24) }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Reveal delay={0.1} className="mt-10 flex justify-center">
        <LinkButton to="/products" variant="outline" size="lg">
          Browse the full catalogue <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </Reveal>
    </section>
  )
}

export { CATEGORY_LABEL }
