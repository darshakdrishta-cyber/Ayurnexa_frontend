import { cn } from './utils'

export function Card({ children, className, hover = false, padded = true, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgb(14_21_18/0.04)]',
        hover &&
          'transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-[0_18px_40px_-18px_rgb(31_118_84/0.35)] dark:hover:border-primary-800',
        padded ? 'p-6' : 'p-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Badge({ children, className, variant = 'primary' }) {
  const variants = {
    primary: 'bg-primary-50 text-primary-800 border-primary-100 dark:bg-primary-950 dark:text-primary-200 dark:border-primary-900',
    secondary: 'bg-secondary-50 text-secondary-800 border-secondary-100 dark:bg-secondary-950 dark:text-secondary-200 dark:border-secondary-900',
    outline: 'bg-card/70 text-muted-foreground border-border backdrop-blur',
    success: 'bg-success-50 text-success border-success-100',
    dark: 'bg-foreground text-background border-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
