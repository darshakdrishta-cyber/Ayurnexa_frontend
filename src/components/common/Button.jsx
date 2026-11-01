import { cloneElement, isValidElement } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from './utils'

const VARIANTS = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-900/20',
  secondary:
    'bg-secondary-500 text-white hover:bg-secondary-600 shadow-sm shadow-secondary-900/25',
  outline:
    'border border-border bg-card text-foreground hover:border-primary-300 hover:text-primary-700 dark:hover:border-primary-700 dark:hover:text-primary-300',
  ghost:
    'text-foreground hover:bg-muted',
  link:
    'text-primary-700 dark:text-primary-300 underline-offset-4 hover:underline px-0',
  danger: 'bg-destructive text-white hover:opacity-90',
}

const SIZES = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-[15px] gap-2',
  icon: 'h-10 w-10 p-0',
}

const BASE =
  'inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap'

/**
 * Button — motion micro-interactions (hover lift, tap press).
 * `asChild` renders the child (Link, <a>) with button styling merged in.
 */
export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  ...props
}) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className)

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: cn(classes, children.props.className),
    })
  }

  return (
    <motion.button
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={classes}
      {...props}
    >
      {children}
    </motion.button>
  )
}

/** Link-styled button for router navigation. */
export function LinkButton({ to, children, className, variant = 'primary', size = 'md', ...props }) {
  return (
    <motion.span whileHover={{ y: -1.5 }} whileTap={{ scale: 0.97 }} className="inline-block">
      <Link to={to} className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props}>
        {children}
      </Link>
    </motion.span>
  )
}
