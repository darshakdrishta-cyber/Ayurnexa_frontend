import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, PackageCheck, ShieldCheck, Zap } from 'lucide-react'
import { LinkButton } from '../common/Button'
import { useAppSelector } from '../../hooks/redux'

const EASE = [0.22, 1, 0.36, 1]
const TRUST_POINTS = [
  { icon: PackageCheck, label: 'Batch-tested formula' },
  { icon: ShieldCheck, label: 'Discreet packaging' },
  { icon: Zap, label: 'Fast-acting vitality support' },
  { icon: ShieldCheck, label: 'Secure online payment (UPI)' },
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
            <span className="h-px w-8 bg-secondary-500" /> Ayurveda for men’s vitality
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="max-w-[14ch] text-balance font-display text-[2.9rem] font-medium leading-[1.02] text-foreground sm:text-6xl lg:text-[4.75rem]"
          >
            Reclaim your bed productivity<span className="text-primary-700 dark:text-primary-300"> — naturally.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
            className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
          >
            Ayurnex Bana is an Ayurvedic vitality formula built to support stamina, drive and intimate performance — so you show up with confidence, night after night. Powerful sex drive, restored naturally. Discreet packaging, private delivery.
          </motion.p>

  

          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <Icon className="h-4 w-4 text-primary-700 dark:text-primary-300" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
          <p className="mt-3 max-w-lg text-xs leading-5 text-muted-foreground">
            Note (for a limited time): pay securely online via UPI to confirm your order instantly.
          </p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="relative mx-auto w-full max-w-2xl lg:max-w-none"
        >
          <div className="relative min-h-[390px] overflow-hidden bg-primary-900 sm:min-h-[510px] lg:min-h-[590px]">
            <motion.img
              style={{ y: imageY, scale: 1.12 }}
              src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1600&q=85"
              alt="Healthy superactive man with strong vitality"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-primary-950/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary-950/50 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white sm:bottom-9 sm:left-9 sm:right-9">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">Rooted in Ayurveda</p>
                <p className="mt-1 font-display text-2xl font-medium sm:text-3xl">Stronger nights. Confident days.</p>
              </div>
              <a
                href="#research"
                aria-label="Scroll to research"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/45 text-white transition hover:border-secondary-300 hover:bg-secondary-500 hover:text-primary-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
          <span className="absolute -bottom-3 left-6 h-1.5 w-20 bg-secondary-500 sm:left-9" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  )
}

export function TrustMarquee() {
  const items = ['Ayurnex Bana', 'Stamina', 'Vitality', 'Confidence', 'Discreet delivery', 'Batch tested', 'UPI or COD']
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-border bg-muted/50 py-4" aria-label="Ayurnex Bana benefits">
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
