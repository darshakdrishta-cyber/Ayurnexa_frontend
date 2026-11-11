import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  Plus,
  Star,
  ShieldCheck,
  Sparkles,
  Leaf,
  Flame,
  Award,
  ChevronRight,
  Eye,
} from 'lucide-react'
import { Button, LinkButton } from '../common/Button'
import { Badge } from '../common/Card'
import { Reveal, SectionHeading } from '../common/Reveal'
import { ProductImage } from '../common/ProductImage'
import { useCart } from '../../context/CartContext'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchProducts } from '../../store/slices/productSlice'

const CATEGORY_TABS = [
  { id: 'all', label: 'All Formulations', icon: Sparkles },
  { id: 'Oil', label: 'Herbal Oils', icon: Flame },
  { id: 'Capsule', label: 'Vitality Capsules', icon: Leaf },
  { id: 'Tablet', label: 'Ayurvedic Tablets', icon: Award },
]

export function ProductCard({ product, compact = false, index = 0 }) {
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
      whileHover={{ y: -8 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xs shadow-xs transition-all duration-300 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-900/5 dark:hover:border-primary-500/30"
    >
      <Link to={`/products/${product.id}`} className="flex h-full flex-col focus-visible:outline-hidden">
        {/* Image Stage */}
        <div className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-muted/20">
          <ProductImage
            product={product}
            className={`w-full transition-transform duration-700 ease-out group-hover:scale-105 ${
              compact ? 'aspect-square' : 'aspect-4/3'
            }`}
          />

          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {product.tag ? (
              <Badge variant="secondary" className="shadow-xs font-semibold backdrop-blur-md">
                {product.tag}
              </Badge>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-700/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                <Leaf className="w-3 h-3 text-secondary-300" /> 100% Pure Ayurveda
              </span>
            )}
            {product.weight && (
              <span className="inline-flex items-center rounded-full bg-background/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-foreground/80 border border-border/50">
                {product.weight}
              </span>
            )}
          </div>

          {/* Hover Quick Action */}
          <div className="absolute inset-x-3 bottom-3 hidden justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex sm:translate-y-2 z-10">
            <span className="flex items-center gap-1.5 rounded-full bg-card/95 px-4 py-2 text-xs font-bold text-foreground shadow-lg backdrop-blur-md border border-border/80">
              <Eye className="h-3.5 w-3.5 text-primary-600" /> View formulation
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400">
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-foreground/80 bg-secondary-50 dark:bg-secondary-950/60 px-2 py-0.5 rounded-full border border-secondary-200/50">
              <Star className="h-3.5 w-3.5 fill-secondary-500 text-secondary-500" />
              {product.rating}
            </span>
          </div>

          <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
            {product.name}
          </h3>

          {!compact && (
            <p className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {product.desc || 'Premium botanical ingredients cold-extracted and formulated for balanced strength, stamina and vitality.'}
            </p>
          )}

          {/* Pricing & Add to Cart button */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-border/60">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                Price
              </span>
              <span className="font-display text-xl font-bold text-foreground">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
            </div>

            <Button
              size="sm"
              variant={added || inCart ? 'secondary' : 'default'}
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className="rounded-xl shadow-xs transition-all active:scale-95"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-white" /> Added
                </>
              ) : inCart ? (
                <>
                  <Check className="h-4 w-4 mr-1" /> In Cart
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" /> Add to cart
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/** Featured interactive product showcase for the Landing page */
export function Shop() {
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector((state) => state.products)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const productSource = useMemo(() => {
    if (!products || !Array.isArray(products)) return []
    return products.map((product) => ({
      id: product.productId || product.id,
      name: product.productName || product.name || 'Ayurvedic Formulation',
      desc: product.productDescription || product.description || product.desc || '',
      price: Number(product.productPrice ?? product.price ?? 0) || 0,
      category: product.productCategory || product.category || 'Ayurveda',
      weight: product.productWeight || product.weight || '',
      rating: product.rating || 4.9,
      reviews: product.reviews || 128,
      image: product.productImage || product.image,
      tag: product.isActive === false ? 'Inactive' : product.tag,
    }))
  }, [products])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return productSource
    return productSource.filter(
      (p) =>
        (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
    )
  }, [productSource, selectedCategory])

  return (
    <section id="shop" className="relative scroll-mt-24 py-20 sm:py-28 overflow-hidden bg-muted/20">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 -left-48 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-48 h-96 w-96 rounded-full bg-secondary-500/10 blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <SectionHeading
          eyebrow="The Apothecary"
          title="Best Ayurvedic Formulations"
          description="Crafted with pure botanicals, cold-pressed oils, and time-tested Vedic rasayanas for natural stamina, strength, and lifelong vitality."
        />

        {/* Category Pill Filters */}
        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CATEGORY_TABS.map(({ id, label, icon: Icon }) => {
            const isActive = selectedCategory === id
            return (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-md shadow-primary-900/20'
                    : 'bg-card text-muted-foreground border border-border hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-700 to-primary-600 -z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`relative z-10 h-4 w-4 ${isActive ? 'text-secondary-300' : 'text-primary-600 dark:text-primary-400'}`} />
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </Reveal>

        {/* Loading Skeleton */}
        {loading && productSource.length === 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-96 rounded-3xl border border-border bg-card/60 p-4 animate-pulse flex flex-col gap-3"
              >
                <div className="h-48 w-full rounded-2xl bg-muted" />
                <div className="h-4 w-2/3 rounded-md bg-muted" />
                <div className="h-4 w-full rounded-md bg-muted" />
                <div className="mt-auto h-10 w-full rounded-xl bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Leaf className="h-12 w-12 text-muted-foreground/60 mb-3" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Formulations updating soon
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Our master herbalists are batch-testing new extracts. Check back soon or view our complete catalogue.
            </p>
            <LinkButton to="/products" variant="outline" size="sm" className="mt-6">
              View all products
            </LinkButton>
          </div>
        )}

        {/* Product Grid with Animations */}
        {filteredProducts.length > 0 && (
          <motion.div
            layout
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Feature Banner Bar */}
        <Reveal delay={0.2} className="mt-16 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md">
          <div className="grid gap-6 sm:grid-cols-3 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex items-center gap-4 px-4 py-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Certified Authentic</h4>
                <p className="text-xs text-muted-foreground">GMP-standard batch tested herbs</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-2 pt-4 sm:pt-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">No Harsh Chemicals</h4>
                <p className="text-xs text-muted-foreground">100% plant & mineral extracts</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-2 pt-4 sm:pt-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Discreet & Private</h4>
                <p className="text-xs text-muted-foreground">Cash on delivery & unmarked box</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom CTA to Full Catalog */}
        <Reveal delay={0.25} className="mt-12 flex justify-center">
          <LinkButton to="/products" variant="secondary" size="lg" className="shadow-lg shadow-secondary-900/10">
            Explore complete apothecary <ChevronRight className="h-4 w-4 ml-1" />
          </LinkButton>
        </Reveal>
      </div>
    </section>
  )
}

export default Shop
