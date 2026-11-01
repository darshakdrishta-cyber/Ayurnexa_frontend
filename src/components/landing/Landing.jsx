import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Hero, TrustMarquee, Research, Features, Story, Billboard, Process, Shop, Testimonials, CTA } from './index'

export function Landing() {
  const { pathname, state } = useLocation()

  useEffect(() => {
    const hash = state?.scrollTo
    if (hash) {
      requestAnimationFrame(() =>
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      )
    } else if (pathname === '/') {
      window.scrollTo({ top: 0 })
    }
  }, [pathname, state])

  return (
    <main className="overflow-x-hidden">
      <Hero />
      <TrustMarquee />
      <Research />
      <Features />
      <Story />
      <Billboard />
      <Process />
      <Shop />
      <Testimonials />
      <CTA />
    </main>
  )
}
