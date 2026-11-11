import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, PackageCheck, ShieldCheck, Zap } from 'lucide-react'
import { LinkButton } from '../common/Button'
import { useAppSelector } from '../../hooks/redux'

const EASE = [0.22, 1, 0.36, 1]
const TRUST_POINTS = [
  { icon: PackageCheck, label: 'Classical Ayurvedic herbs' },
  { icon: ShieldCheck, label: 'GMP certified & batch tested' },
  { icon: Zap, label: 'Pure rasayanas for natural stamina' },
  { icon: ShieldCheck, label: 'Discreet packaging & COD available' },
]

export function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { user, token } = useAppSelector((state) => state.auth)
  const isAuthenticated = Boolean(user || token)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 72])

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-background">
      <div className="container relative grid min-h-[min(760px,calc(100svh-70px))] items-center gap-12 py-12 sm:py-16 lg:grid-cols-1 lg:py-20">
        <div className="relative z-10 flex flex-col items-start gap-6 lg:py-12">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300"
          >
            <span className="h-px w-8 bg-secondary-500" /> Sacred 5,000-Year Vedic Science · Certified Pure
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="max-w-[15ch] text-balance font-display text-[2.9rem] font-medium leading-[1.04] text-foreground sm:text-6xl lg:text-[4.6rem]"
          >
            Rooted in Authentic Ayurveda.<br />
            Powered by <span className="text-primary-700 dark:text-primary-300">Ayurnexa.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
            className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
          >
            Ayurveda teaches that true vitality stems from balanced doshas, nourishing rasayanas, and uncompromised organic botanicals. Ayurnexa harnesses ancient Ayurvedic wisdom — formulating cold-extracted Ashwagandha, purified Himalayan Shilajit, Safed Musli, and therapeutic botanical oils to restore strength, stamina, and natural vigor without synthetic chemicals.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: EASE }}
            className="flex flex-wrap items-center gap-4"
          >
            <LinkButton to="#shop" variant="secondary" size="lg" className="shadow-lg shadow-secondary-900/10">
              Explore bestsellers <ArrowRight className="h-4 w-4 ml-1.5" />
            </LinkButton>
            <LinkButton to="/products" variant="outline" size="lg">
              View all products
            </LinkButton>
          </motion.div>

          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <Icon className="h-4 w-4 text-primary-700 dark:text-primary-300" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
          <p className="mt-3 max-w-lg text-xs leading-5 text-muted-foreground">
            Pay securely online with PayU or choose cash on delivery at checkout.
          </p>
        </div>

      </div>
    </section>
  )
}

export function TrustMarquee() {
  const items = [
    'Authentic Ayurveda',
    'Ayurnexa Formulations',
    'Cold-Pressed Botanical Oils',
    'Himalayan Shilajit',
    'Pure Ashwagandha',
    'GMP Certified',
    'Vedic Rasayanas',
    'Discreet Delivery',
    'Cash on Delivery',
  ]
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-border bg-muted/50 py-4" aria-label="Ayurnexa Bana benefits">
      <div className="animate-marquee flex w-max items-center gap-9">
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary-500" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
