const STEPS = [
  { id: 'PENDING', label: 'Order placed' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'PACKED', label: 'Packed' },
  { id: 'SHIPPED', label: 'Shipped' },
  { id: 'DELIVERED', label: 'Delivered' },
]

export function OrderProgressBar({ orderProgress, className = '' }) {
  const currentIndex = STEPS.findIndex((s) => s.id === orderProgress)
  const completed = currentIndex === -1 ? 0 : currentIndex + 1

  return (
    <div className={className}>
      <div className="relative flex items-center gap-2">
        {STEPS.map((step, i) => {
          const isCompleted = i < completed
          const isCurrent = i === currentIndex
          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              {i > 0 && (
                <div className="relative flex-1 h-1">
                  <div
                    className={`absolute inset-0 h-full transition-all duration-500 ${
                      isCompleted || isCurrent ? 'bg-success-600' : 'bg-border'
                    }`}
                  />
                </div>
              )}
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2">
                {isCompleted ? (
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-sm font-bold ${
                    isCurrent ? 'text-primary-700 dark:text-primary-300' : 'text-muted-foreground'
                  }`}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
