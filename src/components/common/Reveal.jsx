import { motion, useReducedMotion } from 'framer-motion'
import { cn } from './utils'

/** Scroll-reveal wrapper: fades + rises content as it enters the viewport. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div', ...props }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

/** Consistent section heading: eyebrow + title + supporting copy. */
export function SectionHeading({ eyebrow, title, description, align = 'center', className }) {
  const alignment = align === 'left' ? 'text-left items-start' : 'text-center items-center'
  return (
    <Reveal
      className={cn('flex flex-col gap-4', alignment, className)}
      aria-labelledby="section-title"
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary-600 dark:text-secondary-400">
          <span className="h-px w-6 bg-secondary-400" aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-2xl text-balance font-display text-3xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  )
}
