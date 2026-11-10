const STEPS = [
  { id: 'PENDING', label: 'Order placed' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'PACKED', label: 'Packed' },
  { id: 'SHIPPED', label: 'Shipped' },
  { id: 'DELIVERED', label: 'Delivered' },
]

/**
 * Normalizes any backend status or progress string into one of STEPS IDs:
 * PENDING, CONFIRMED, PACKED, SHIPPED, DELIVERED
 */
export function normalizeOrderStatus(status) {
  if (!status) return 'PENDING'
  const upper = String(status).trim().toUpperCase()

  if (upper === 'CREATED' || upper === 'PLACED' || upper === 'PENDING') {
    return 'PENDING'
  }
  if (upper === 'CONFIRMED') {
    return 'CONFIRMED'
  }
  if (upper === 'PACKED' || upper === 'PROCESSING') {
    return 'PACKED'
  }
  if (upper === 'SHIPPED' || upper === 'DISPATCHED' || upper === 'IN_TRANSIT') {
    return 'SHIPPED'
  }
  if (upper === 'DELIVERED' || upper === 'COMPLETED') {
    return 'DELIVERED'
  }

  // Direct match if exact
  const found = STEPS.find((s) => s.id === upper)
  return found ? found.id : 'PENDING'
}

export function OrderProgressBar({ orderStatus, orderProgress, status, className = '' }) {
  // Always check orderStatus first, then orderProgress / status
  const rawStatus = orderStatus || orderProgress || status || 'PENDING'
  const activeStepId = normalizeOrderStatus(rawStatus)
  const currentIndex = STEPS.findIndex((s) => s.id === activeStepId)
  const completedCount = currentIndex === -1 ? 0 : currentIndex + 1

  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center justify-between w-full">
        {STEPS.map((step, i) => {
          const isCompleted = i < completedCount
          const isCurrent = i === currentIndex

          return (
            <div key={step.id} className="relative flex-1 flex flex-col items-center">
              {/* Connecting line to previous step */}
              {i > 0 && (
                <div
                  className={`absolute top-4 -left-1/2 w-full h-[2px] -z-0 transition-all duration-300 ${
                    i <= currentIndex ? 'bg-primary-600 dark:bg-primary-500' : 'bg-border'
                  }`}
                />
              )}

              {/* Step Circle */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'border-primary-600 bg-primary-600 text-white shadow-sm ring-4 ring-primary-100 dark:ring-primary-950/60 scale-110 font-bold'
                    : isCompleted
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-border bg-card text-muted-foreground'
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{i + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`mt-2 text-center text-[11px] uppercase tracking-wider transition-colors ${
                  isCurrent
                    ? 'font-bold text-primary-700 dark:text-primary-300'
                    : isCompleted
                    ? 'font-medium text-foreground'
                    : 'font-normal text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
