import { ArrowRight, ShoppingBag } from 'lucide-react'
import { LinkButton } from '../common/Button'
import { Reveal } from '../common/Reveal'
import { useAppSelector } from '../../hooks/redux'

export function CTA() {
  const { user, token } = useAppSelector((state) => state.auth)
  const isAuthenticated = Boolean(user || token)

  return (
    <section className="container pb-6 pt-12 sm:pt-16">
      <Reveal className="relative overflow-hidden bg-primary-800 px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
        <span className="absolute right-0 top-0 h-full w-2 bg-secondary-500" aria-hidden="true" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary-300">
              Start your recovery today
            </p>
            <h2 className="mt-4 text-balance font-display text-3xl font-medium leading-tight sm:text-4xl">
              Feel like yourself again. Try Ayurnex Bana.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Reclaim your bed productivity, stamina and confidence — discreetly, naturally, at your own pace.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <LinkButton to="/products" variant="secondary" size="lg" className="w-full sm:w-auto">
              Shop Ayurnex Bana <ArrowRight className="h-4 w-4" />
            </LinkButton>
            {!isAuthenticated ? (
              <LinkButton
                to="/signup"
                variant="outline"
                size="lg"
                className="w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Create account
              </LinkButton>
            ) : (
              <LinkButton
                to="/cart"
                variant="outline"
                size="lg"
                className="w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <ShoppingBag className="h-4 w-4 mr-2" /> View bag
              </LinkButton>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
