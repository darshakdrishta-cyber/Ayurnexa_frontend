import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ArrowRight, ExternalLink } from 'lucide-react'
import { getOffers } from '../../services/offers'

export function OfferModal() {
  const [activeOffer, setActiveOffer] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    let alive = true
    async function loadOffers() {
      try {
        const offers = await getOffers(false)
        if (!alive || !Array.isArray(offers) || offers.length === 0) return

        // Pick the most recent active offer
        const eligible = offers.find(
          (o) => o.is_active !== false && !o.offerdeleted
        )
        if (!eligible) return

        const offerId = eligible.offerId || eligible.id || eligible.offername
        const seenKey = `ayurnexa_offer_seen_${offerId}`

        // Check if user has already dismissed this specific offer this session
        const hasSeen = sessionStorage.getItem(seenKey)
        if (!hasSeen) {
          setActiveOffer(eligible)
          // Small delay for smooth entry after landing render
          const timer = setTimeout(() => {
            if (alive) setIsOpen(true)
          }, 1200)
          return () => clearTimeout(timer)
        }
      } catch {
        // Silently fail if offers API is offline or returns empty
      }
    }

    loadOffers()
    return () => {
      alive = false
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    if (activeOffer) {
      const offerId = activeOffer.offerId || activeOffer.id || activeOffer.offername
      try {
        sessionStorage.setItem(`ayurnexa_offer_seen_${offerId}`, 'true')
      } catch {}
    }
  }

  if (!isOpen || !activeOffer) return null

  // Check if offerlink or additionallink is an image URL
  const isImageLink = (url) => {
    if (!url) return false
    return (
      url.match(/\.(jpeg|jpg|gif|png|webp|avif)($|\?)/i) ||
      url.includes('/offerScreens/') ||
      url.includes('/public/Ayurnexa/')
    )
  }

  const imageUrl = isImageLink(activeOffer.offerlink)
    ? activeOffer.offerlink
    : isImageLink(activeOffer.additionallink)
    ? activeOffer.additionallink
    : null

  const targetLink = !isImageLink(activeOffer.offerlink)
    ? activeOffer.offerlink
    : activeOffer.additionallink || '/products'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition"
            aria-label="Close offer modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner Image if provided */}
          {imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={imageUrl}
                alt={activeOffer.offername}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            </div>
          )}

          {/* Offer Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 dark:bg-primary-950 px-2.5 py-0.5 text-xs font-bold text-primary-700 dark:text-primary-300">
                <Sparkles className="w-3 h-3 text-primary-600" /> Special Offer
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {activeOffer.offername}
            </h3>

            {activeOffer.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {activeOffer.description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={targetLink}
                target={targetLink.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                onClick={handleClose}
                className="w-full sm:flex-1 inline-flex items-center justify-center rounded-xl bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition"
              >
                Claim Offer <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>

              {activeOffer.additionallink && !isImageLink(activeOffer.additionallink) && (
                <a
                  href={activeOffer.additionallink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center text-xs text-muted-foreground hover:text-foreground py-2 px-3 underline gap-1"
                >
                  Terms <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
export default OfferModal
