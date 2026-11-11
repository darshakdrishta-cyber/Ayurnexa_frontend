import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone, MapPin } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Reveal } from './Reveal'
import { useAppSelector } from '../../hooks/redux'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/products' },
      { label: 'Medicines', to: '/products?category=medicine' },
      { label: 'Supplements', to: '/products?category=supplements' },
      { label: 'Personal care', to: '/products?category=personal-care' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our story', to: '/', hash: 'story' },
      { label: 'How it works', to: '/', hash: 'process' },
      { label: 'Categories', to: '/', hash: 'shop' },
      { label: 'Sign in', to: '/login' },
    ],
  },
]

export default function Footer() {
  const { user, token } = useAppSelector((state) => state.auth)
  const isAuthenticated = Boolean(user || token)

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-card">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[46rem] -translate-x-1/2 rounded-full bg-primary-100/60 blur-3xl dark:bg-primary-950/50"
      />
      <Reveal className="container relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-sm font-extrabold text-white">
              A
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-foreground">
              Ayur<span className="text-primary-700 dark:text-primary-300">nexa</span>
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Authentic Ayurvedic medicine and wellness rituals — sourced from trusted farms,
            lab-tested in every batch, delivered across India.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary-600 dark:text-secondary-400">
              {col.title}
            </h3>
            {col.links
              .filter((link) => !isAuthenticated || link.to !== '/login')
              .map((link) =>
                link.hash ? (
                  <a
                    key={link.label}
                    href={`/#${link.hash}`}
                    className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                )
              )}
          </nav>
        ))}

        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary-600 dark:text-secondary-400">
            Reach us
          </h3>
          {[
            { icon: Mail, text: 'info@ayurnexa.com', href: 'mailto:info@ayurnexa.com' },
            { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
            { icon: MapPin, text: 'Kerala, India' },
          ].map(({ icon: Icon, text, href }) => (
            href ? (
              <a
                key={text}
                href={href}
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                {text}
              </a>
            ) : (
              <p key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                {text}
              </p>
            )
          ))}
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <ThemeToggle /> Appearance
          </div>
        </div>
      </Reveal>

      <div className="relative border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Ayurnexaa. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Leaf className="h-3.5 w-3.5 text-primary-600" /> for holistic wellness
          </p>
        </div>
      </div>
    </footer>
  )
}
