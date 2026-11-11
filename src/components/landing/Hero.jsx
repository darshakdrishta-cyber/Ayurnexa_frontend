import { ArrowRight, Leaf, ShieldCheck, Sparkles, Check } from 'lucide-react'
import { LinkButton } from '../common/Button'

export function Hero() {
  return (
    <section className="hero">
      <div className="container in">
        {/* Left Column: Vedic Copy & Call to Action */}
        <div className="content">
          <p className="eyebrow rise text-xs font-bold uppercase tracking-[0.18em]">
            Sacred 5,000-Year Vedic Science · 100% Certified Pure
          </p>

          <h1 className="rise d1">
            Ayurveda. <i>Reborn.</i>
          </h1>

          <div className="deva rise d1">
            आयुर्वेदः अमृतम् — Vitality from Nature's Roots
          </div>

          <p className="lead rise d2 text-base sm:text-lg">
            Ancient Ayurvedic healing meets modern purity. Formulated with cold-extracted
            organic botanicals, purified Himalayan Shilajit, and potent Vedic rasayanas
            to restore your natural strength, focus, and lifelong vitality.
          </p>

          <div className="cta-row rise d3">
            <LinkButton
              to="#shop"
              variant="secondary"
              size="lg"
              className="shadow-xl shadow-black/30 font-semibold"
            >
              Explore Formulations <ArrowRight className="h-4 w-4 ml-1.5" />
            </LinkButton>
            <LinkButton
              to="/products"
              variant="outline"
              size="lg"
              className="border-[rgba(234,241,228,0.3)] text-white hover:bg-white/10 hover:text-white"
            >
              Browse Catalog
            </LinkButton>
          </div>

          <div className="facts rise d3">
            <span>• GMP Certified</span>
            <span>• Cold-Pressed Oils</span>
            <span>• 100% Plant Rasayanas</span>
            <span>• Cash on Delivery</span>
          </div>
        </div>

        {/* Right Column: Ayurvedic Product Packaging Illustration */}
        <div className="visual rise d2 flex justify-center">
          <svg
            className="pack"
            viewBox="0 0 440 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Ayurnexa Ayurvedic Formulation Pack"
          >
            <defs>
              <linearGradient id="bottleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1E4731" />
                <stop offset="50%" stopColor="#133624" />
                <stop offset="100%" stopColor="#0B2317" />
              </linearGradient>

              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#D4A73A" />
                <stop offset="100%" stopColor="#946D1F" />
              </linearGradient>

              <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4A73A" />
                <stop offset="100%" stopColor="#7A581A" />
              </linearGradient>

              <filter id="packGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#000" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Ambient Background Aura */}
            <circle cx="220" cy="270" r="160" fill="url(#goldGrad)" opacity="0.12" filter="blur(30px)" />

            {/* Packaging Container */}
            <g filter="url(#packGlow)">
              {/* Bottle Cap */}
              <rect x="175" y="45" width="90" height="40" rx="8" fill="url(#capGrad)" />
              <rect x="180" y="52" width="80" height="4" rx="2" fill="#FEF3C7" opacity="0.4" />
              <rect x="195" y="85" width="50" height="18" fill="#133624" />

              {/* Bottle Neck & Body */}
              <path
                d="M190 102 C190 135 120 150 120 195 L120 440 C120 460 136 475 156 475 L284 475 C304 475 320 460 320 440 L320 195 C320 150 250 135 250 102 Z"
                fill="url(#bottleGrad)"
                stroke="url(#goldGrad)"
                strokeWidth="2.5"
              />

              {/* Glass Reflection Highlight */}
              <path
                d="M136 210 L136 435 C136 448 142 455 150 458 C144 450 142 435 142 420 L142 215 C142 195 150 180 158 170 C146 182 136 195 136 210 Z"
                fill="#FFFFFF"
                opacity="0.18"
              />

              {/* Label Backing */}
              <rect
                x="142"
                y="190"
                width="156"
                height="225"
                rx="12"
                fill="#0A1E14"
                stroke="url(#goldGrad)"
                strokeWidth="1.5"
              />

              {/* Inner Decorative Border */}
              <rect
                x="148"
                y="196"
                width="144"
                height="213"
                rx="8"
                fill="none"
                stroke="rgba(212,167,58,0.3)"
                strokeWidth="1"
              />

              {/* Label Content */}
              <text
                x="220"
                y="226"
                textAnchor="middle"
                className="mono"
                fontSize="9"
                letterSpacing="3"
                fill="url(#goldGrad)"
                fontWeight="700"
              >
                AYURVEDIC RASAYANA
              </text>

              <text
                x="220"
                y="262"
                textAnchor="middle"
                fontSize="24"
                fontWeight="700"
                fill="#FFFFFF"
                letterSpacing="1"
              >
                AYURNEXA
              </text>

              <text
                x="220"
                y="280"
                textAnchor="middle"
                fontSize="12"
                fill="url(#goldGrad)"
                fontWeight="600"
                fontStyle="italic"
              >
                BĀNA · VITALITY FORMULA
              </text>

              {/* Divider Line */}
              <line x1="170" y1="295" x2="270" y2="295" stroke="url(#goldGrad)" strokeWidth="1" opacity="0.6" />

              {/* Ayurvedic Deva Emblem */}
              <circle cx="220" cy="330" r="22" fill="#133624" stroke="url(#goldGrad)" strokeWidth="1.2" />
              <path
                d="M220 318 C226 324 228 334 220 340 C212 334 214 324 220 318 Z"
                fill="url(#goldGrad)"
              />
              <circle cx="220" cy="331" r="3" fill="#133624" />

              <text
                x="220"
                y="370"
                textAnchor="middle"
                className="mono"
                fontSize="8.5"
                letterSpacing="1.5"
                fill="#E2E8F0"
                opacity="0.85"
              >
                ORGANIC BOTANICAL EXTRACT
              </text>

              <text
                x="220"
                y="386"
                textAnchor="middle"
                className="mono"
                fontSize="8"
                letterSpacing="2"
                fill="url(#goldGrad)"
              >
                100ML · COLD PRESSED
              </text>

              {/* Certified Stamp */}
              <rect x="180" y="396" width="80" height="12" rx="4" fill="rgba(212,167,58,0.15)" />
              <text
                x="220"
                y="405"
                textAnchor="middle"
                className="mono"
                fontSize="7"
                letterSpacing="1"
                fill="url(#goldGrad)"
                fontWeight="700"
              >
                ★ GMP TESTED PURITY ★
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}

export function TrustMarquee() {
  const items = [
    'Authentic Ayurveda',
    'Ayurnexa Formulations',
    'Cold-Pressed Botanical Oils',
    'Himalayan Shilajit',
    'Pure Ashwagandha',
    'GMP Certified',
    'Vedic Rasayanas',
    'Discreet Delivery',
    'Cash on Delivery',
  ]
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-border bg-muted/50 py-4" aria-label="Ayurnexa benefits">
      <div className="animate-marquee flex w-max items-center gap-9">
        {doubled.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-secondary-500" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Hero
