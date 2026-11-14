import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Building, Home, X, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '../common/Button'

export function AddressModal({ isOpen, onClose, onSubmit, initialAddress }) {
  const [address, setAddress] = useState({
    building: initialAddress?.building || '',
    landmark: initialAddress?.landmark || '',
    pincode: initialAddress?.pincode || '',
    phoneNumber: initialAddress?.phoneNumber || '',
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!address.building.trim()) {
      errs.building = 'Building, Flat, or Street address is required'
    }
    if (!address.pincode.trim()) {
      errs.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(address.pincode.trim())) {
      errs.pincode = 'Enter a valid 6-digit Indian pincode'
    }
    if (!address.phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required for discreet delivery'
    } else if (!/^[6-9]\d{9}$/.test(address.phoneNumber.replace(/[\s-+]/g, ''))) {
      errs.phoneNumber = 'Enter a valid 10-digit mobile number'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      building: address.building.trim(),
      landmark: address.landmark.trim(),
      pincode: address.pincode.trim(),
      phoneNumber: address.phoneNumber.trim(),
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Delivery Address
                </h3>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Enter your shipping details before selecting payment. Packaging is 100% discreet.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Building / Flat / House */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                House / Building / Flat / Street <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Building className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. Tower B, Flat 402, Green Valley Apartments"
                  value={address.building}
                  onChange={(e) => {
                    setAddress({ ...address, building: e.target.value })
                    if (errors.building) setErrors({ ...errors, building: null })
                  }}
                  className={`w-full rounded-xl border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary-500/30 ${
                    errors.building ? 'border-destructive' : 'border-border focus:border-primary-500'
                  }`}
                />
              </div>
              {errors.building && (
                <p className="mt-1 text-xs text-destructive">{errors.building}</p>
              )}
            </div>

            {/* Landmark (Optional) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Landmark <span className="text-xs text-muted-foreground/80 lowercase">(optional)</span>
              </label>
              <div className="relative">
                <Home className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. Near City Hospital or Metro Gate 2"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Pincode & Phone Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Pincode <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 400001"
                    value={address.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setAddress({ ...address, pincode: val })
                      if (errors.pincode) setErrors({ ...errors, pincode: null })
                    }}
                    className={`w-full rounded-xl border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary-500/30 ${
                      errors.pincode ? 'border-destructive' : 'border-border focus:border-primary-500'
                    }`}
                  />
                </div>
                {errors.pincode && (
                  <p className="mt-1 text-xs text-destructive">{errors.pincode}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Mobile Number <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={address.phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setAddress({ ...address, phoneNumber: val })
                      if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null })
                    }}
                    className={`w-full rounded-xl border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary-500/30 ${
                      errors.phoneNumber ? 'border-destructive' : 'border-border focus:border-primary-500'
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-destructive">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            {/* Note & Security */}
            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary-600 shrink-0" />
              <span>Your address is strictly used for order delivery and kept private.</span>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" className="gap-2">
                Save & Choose Payment <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
export default AddressModal
