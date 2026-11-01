import { ArrowRight, Check } from 'lucide-react'
import { LinkButton } from '../common/Button'
import { Reveal } from '../common/Reveal'

const DETAILS = [
  'Ayurvedic formula for stamina, drive and intimate performance',
  'Supports bed productivity and confidence with consistent use',
  'Discreet packaging and private delivery across India',
]

export function Story() {
  return (
    <section id="story" className="scroll-mt-24 border-y border-border bg-muted/50 py-20 sm:py-24">
      <div className="container grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[5/4] overflow-hidden bg-primary-900">
            <img
              src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=85"
              alt="Confident man after restoring his vitality with Ayurnex Bana"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 to-transparent" />
            <p className="absolute bottom-5 left-5 font-display text-xl text-white sm:bottom-7 sm:left-7 sm:text-2xl">
              After Ayurnex Bana
            </p>
          </div>
          <span className="absolute -bottom-2 -right-2 h-16 w-16 border-b-4 border-r-4 border-secondary-500" aria-hidden="true" />
        </Reveal>

        <div className="flex flex-col items-start gap-5">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">
              <span className="h-px w-7 bg-secondary-500" /> The Ayurnex Bana difference
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="max-w-xl text-balance font-display text-3xl font-medium leading-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
              Vitality should feel natural, not complicated.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Ayurnex Bana brings Ayurvedic energy formulations into a calm, private storefront. Choose what fits your routine, pay how you want and keep your orders discreet.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ul className="flex flex-col gap-3 border-t border-border pt-5">
              {DETAILS.map((detail) => (
                <li key={detail} className="flex items-start gap-3 text-sm leading-6 text-foreground">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary-700 dark:text-primary-300" aria-hidden="true" />
                  {detail}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.24}>
            <LinkButton to="/products" variant="outline" className="mt-1">
              Browse the range <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
