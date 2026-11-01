import { ArrowUpRight, ShieldCheck, Zap, Heart, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal, SectionHeading } from '../common/Reveal'

const ITEMS = [
  {
    icon: Zap,
    number: '01',
    title: 'Restored stamina',
    desc: 'Ayurnex Bana supports energy and endurance for stronger, more confident nights.',
    href: '/products',
  },
  {
    icon: Heart,
    number: '02',
    title: 'Intimate confidence',
    desc: 'Feel present and assured — performance anxiety fades with consistent use.',
    href: '/products',
  },
  {
    icon: Leaf,
    number: '03',
    title: 'Ayurvedic roots',
    desc: 'Ashwagandha, shilajit and time-tested herbs — no harsh synthetics.',
    href: '/products',
  },
  {
    icon: ShieldCheck,
    number: '04',
    title: 'Discreet delivery',
    desc: 'Plain packaging, UPI or COD, and private tracking from order to doorstep.',
    href: '/login',
  },
]

export function Features() {
  return (
    <section className="container py-20 sm:py-24">
      <SectionHeading
        eyebrow="Why Ayurnex Bana"
        title="Energy, drive and confidence — restored"
        description="A clear, private path from low vitality to your best self. Browse, pay your way, and track discreetly."
      />

      <div className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 0.06}
            className="group border-t border-border py-6"
          >
            <Link to={item.href} className="flex h-full flex-col items-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="flex w-full items-center justify-between text-xs font-semibold tabular-nums text-muted-foreground">
                {item.number}
                <item.icon className="h-5 w-5 text-primary-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-primary-300" aria-hidden="true" />
              </span>
              <h3 className="mt-8 font-display text-xl font-medium text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-300">
                Explore <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
