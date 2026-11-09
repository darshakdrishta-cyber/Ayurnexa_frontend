import { ClipboardList, PackageCheck, Truck } from 'lucide-react'
import { Reveal, SectionHeading } from '../common/Reveal'

const STEPS = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Choose Ayurnex Bana',
    desc: 'Pick the formula that fits your routine and goals.',
  },
  {
    icon: PackageCheck,
    step: '02',
    title: 'Pay your way',
    desc: 'Pay securely online with PayU or choose cash on delivery.',
  },
  {
    icon: Truck,
    step: '03',
    title: 'Track discreetly',
    desc: 'See your order progress from placement to delivery, in plain packaging.',
  },
]

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 bg-muted/60 py-20 sm:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps to renewed vitality"
          description="Choose Ayurnex Bana, pay securely with PayU or cash on delivery, and track it discreetly."
        />

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-12 hidden border-t-2 border-dashed border-primary-200 dark:border-primary-800 md:block"
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1} className="relative">
              <div className="flex h-full flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-30px_rgb(55_31_112/0.4)]">
                <span className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-900 dark:bg-primary-950 dark:text-primary-300">
                  <step.icon className="h-9 w-9" strokeWidth={1.6} />
                  <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-secondary-500 text-[11px] font-extrabold text-white">
                    {step.step}
                  </span>
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
