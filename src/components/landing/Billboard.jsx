import { ArrowRight } from 'lucide-react'
import { LinkButton } from '../common/Button'
import { Reveal } from '../common/Reveal'

export function Billboard() {
  return (
    <section className="relative isolate overflow-hidden py-0">
      <div className="relative min-h-[420px] sm:min-h-[520px]">
        <img
          src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1800&q=85"
          alt="Strong, confident man representing restored vitality after Ayurnex Bana"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-950/55 to-transparent" />
        <div className="container relative flex min-h-[420px] items-center sm:min-h-[520px]">
          <Reveal className="max-w-xl text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-300">Ayurnex Bana</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
              Feel the power. <span className="text-secondary-300">Own the night.</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-white/80">
              Restore stamina, drive and intimate confidence — the Ayurvedic way. Discreet, natural, effective.
            </p>
            <LinkButton to="/products" variant="secondary" size="lg" className="mt-6">
              Shop Ayurnex Bana <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
