import { cn } from './utils'

export function Field({ label, hint, error, children, htmlFor, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-foreground">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

const INPUT_BASE =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-primary-400'

export function Input({ className, ...props }) {
  return <input className={cn(INPUT_BASE, className)} {...props} />
}

export function InputIcon({ icon: Icon, children }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
      <div className="[&_input]:pl-12">{children}</div>
    </div>
  )
}
