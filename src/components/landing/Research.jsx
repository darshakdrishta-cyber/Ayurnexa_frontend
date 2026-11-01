import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { TrendingDown, Activity, HeartPulse, Moon, Users, Baby, Brain, BedDouble, Users2, Dumbbell } from 'lucide-react'
import { Reveal, SectionHeading } from '../common/Reveal'

const STATS = [
  {
    icon: TrendingDown,
    value: 40,
    suffix: '%',
    label: 'Decline in sperm concentration in Western men over 4 decades',
    source: 'Levine et al., 2017 (Human Reproduction Update)',
  },
  {
    icon: Activity,
    value: 20,
    suffix: '%',
    label: 'Drop in testosterone linked to chronic stress & social tension',
    source: 'Population endocrinology studies',
  },
  {
    icon: Moon,
    value: 15,
    suffix: '%',
    label: 'Testosterone reduction from just one week of poor sleep',
    source: 'Sleep medicine research',
  },
  {
    icon: Users,
    value: 1,
    suffix: ' in 7',
    label: 'Couples worldwide facing fertility challenges',
    source: 'WHO estimates',
  },
  {
    icon: HeartPulse,
    value: 35,
    suffix: '%',
    label: 'Of men report low energy affecting intimate life',
    source: 'Men’s health surveys',
  },
  {
    icon: Baby,
    value: 50,
    suffix: '%',
    label: 'Rise in couples seeking fertility support in the last decade',
    source: 'Reproductive health reports',
  },
]

function Counter({ to, suffix, inView }) {
  const [n, setN] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const duration = 1400
    const start = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])

  return (
    <span className="tabular-nums">
      {n}
      {suffix}
    </span>
  )
}

const DRIVERS = [
  {
    icon: Brain,
    title: 'Chronic stress',
    short: 'Cortisol suppresses testosterone',
    detail: 'Ongoing stress keeps cortisol high, which directly suppresses testosterone production and libido. Social tension amplifies this loop.',
    level: 82,
  },
  {
    icon: Users2,
    title: 'Social tension',
    short: 'Anxiety reduces performance confidence',
    detail: 'Relationship strain and social pressure raise anxiety, lowering desire and making intimate performance feel harder.',
    level: 68,
  },
  {
    icon: BedDouble,
    title: 'Poor sleep',
    short: 'Overnight testosterone drops',
    detail: 'Most testosterone is produced during deep sleep. Even one week of short sleep can cut levels by 10–15%.',
    level: 74,
  },
  {
    icon: Dumbbell,
    title: 'Lifestyle',
    short: 'Sedentary habits, poor diet',
    detail: 'Low activity, excess weight and poor nutrition further depress energy, stamina and reproductive health.',
    level: 60,
  },
]

export function Research() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState(0)
  const driver = DRIVERS[active]

  return (
    <section id="research" className="scroll-mt-24 bg-muted/60 py-20 sm:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="The research"
          title="The decline is real — and it’s not just age"
          description="Across studies, male vitality, testosterone and fertility are trending down. Social tension, stress and lifestyle are major drivers. Ayurnex Bana exists to help you push back."
        />

        <div ref={ref} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary-200 dark:hover:border-primary-800"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Research</span>
              </div>
              <p className="font-display text-4xl font-semibold text-primary-700 dark:text-primary-300">
                <Counter to={s.value} suffix={s.suffix} inView={inView} />
              </p>
              <p className="text-sm leading-6 text-foreground">{s.label}</p>
              <p className="mt-auto text-[11px] leading-5 text-muted-foreground italic">{s.source}</p>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12 rounded-3xl border border-border bg-card p-7 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <h3 className="font-display text-2xl font-medium text-foreground">What drives the decline</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Tap a driver to see how it affects male vitality. Ayurnex Bana is formulated to support your body against these pressures.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {DRIVERS.map((d, i) => (
                  <button
                    key={d.title}
                    onClick={() => setActive(i)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      i === active
                        ? 'border-primary-300 bg-primary-50 text-primary-800 dark:border-primary-700 dark:bg-primary-950 dark:text-primary-200'
                        : 'border-border bg-card text-foreground hover:border-primary-200'
                    }`}
                  >
                    <d.icon className="h-5 w-5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{d.title}</p>
                      <p className="text-xs text-muted-foreground">{d.short}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={driver.title}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-border bg-muted/40 p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
                    <driver.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h4 className="font-display text-xl font-medium text-foreground">{driver.title}</h4>
                    <p className="text-xs text-muted-foreground">{driver.short}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{driver.detail}</p>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>Impact on vitality</span>
                    <span className="tabular-nums text-primary-700 dark:text-primary-300">{driver.level}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${driver.level}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-600 to-secondary-500"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
