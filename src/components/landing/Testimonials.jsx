import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Reveal, SectionHeading } from '../common/Reveal'

const REVIEWS = [
  {
    name: 'Rahul Mehta',
    city: 'Delhi',
    initials: 'RM',
    tone: 'bg-primary-600',
    product: 'Ayurnex Bana',
    text: 'Two weeks in and my energy in the bedroom is completely different. I feel present, confident and actually rested the next morning.',
  },
  {
    name: 'Vikram Singh',
    city: 'Jaipur',
    initials: 'VS',
    tone: 'bg-secondary-500',
    product: 'Ayurnex Bana',
    text: 'Stress had killed my drive. Ayurnex Bana brought it back without any side effects. Discreet delivery was a big plus.',
  },
  {
    name: 'Ankit Sharma',
    city: 'Lucknow',
    initials: 'AS',
    tone: 'bg-primary-800',
    product: 'Ayurnex Bana',
    text: 'My partner noticed the change before I did. More stamina, better mood, and zero awkward questions thanks to plain packaging.',
  },
  {
    name: 'Suresh Pillai',
    city: 'Kochi',
    initials: 'SP',
    tone: 'bg-secondary-700',
    product: 'Ayurnex Bana',
    text: 'I have tried four brands. Ayurnex Bana is the only one that actually delivers on stamina and confidence. Easy UPI checkout too.',
  },
]

const AUTOPLAY_MS = 6000

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const review = REVIEWS[index]

  const go = (dir) => setIndex((i) => (i + dir + REVIEWS.length) % REVIEWS.length)

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => go(1), AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [index, paused])

  return (
    <section
      id="reviews"
     // className="container scroll-mt-24 py-20 sm:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* <SectionHeading
        eyebrow="Reviews"
        title="Real men, real results"
        description="Feedback from people who made Ayurnex Bana part of their routine."
      /> */}

      {/* <Reveal delay={0.1} className="relative mx-auto mt-12 max-w-4xl">
        <Quote
          className="absolute -top-6 left-6 h-16 w-16 rotate-180 fill-primary-100 text-primary-100 dark:fill-primary-950 dark:text-primary-950 sm:-top-10 sm:left-10 sm:h-24 sm:w-24"
          aria-hidden="true"
        />

        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-7 shadow-[0_30px_70px_-45px_rgb(20_63_48/0.7)] sm:p-12">
          <div className="flex gap-1" aria-label={`Rated ${review.name}`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4.5 w-4.5 fill-secondary-400 text-secondary-400" />
            ))}
          </div>

          <div className="relative mt-5 min-h-[168px] sm:min-h-[136px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={review.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-balance font-display text-lg leading-relaxed text-foreground sm:text-2xl sm:leading-[1.45]"
              >
                “{review.text}”
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-6">
            <div className="flex items-center gap-3.5">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${review.tone}`}
              >
                {review.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{review.name}</p>
                <p className="text-xs text-muted-foreground">
                  {review.city} · bought {review.product}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="mr-2 flex gap-1.5">
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Show review ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? 'w-7 bg-primary-600' : 'w-2 bg-border hover:bg-primary-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next review"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-950"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      </Reveal> */}
    </section>
  )
}
