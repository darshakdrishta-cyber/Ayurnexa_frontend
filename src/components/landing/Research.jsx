import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal, SectionHeading } from '../common/Reveal'
import { Leaf, Award, ShieldCheck, Activity, Sparkles, Brain, CheckCircle2 } from 'lucide-react'

export function Research() {
  const [activeDriver, setActiveDriver] = useState(0)

  return (
    <section id="research" className="scroll-mt-24 py-20 sm:py-28 bg-muted/20 border-y border-border/60">
      <div className="container">
        {/* Section Heading */}
        <SectionHeading
          eyebrow="Clinical Science & Vedic Heritage"
          title="The Ayurvedic Paper on Vitality"
          description="Modern clinical validation of ancient Vedic Rasayana therapy. How pure botanical adaptogens reverse chronic fatigue and rebuild natural vigor."
        />

        <div className="paper mt-16">
          {/* Left Meta Sidebar */}
          <aside className="meta">
            <div>
              <b>Study Dossier</b>
              <span>AYUR-VIT-2026.04</span>
            </div>

            <div>
              <b>Subject Scope</b>
              <div className="scope mt-1">
                Classical Rasayana therapy vs. modern cortisol-induced vitality depletion.
              </div>
            </div>

            <div>
              <b>Methodology</b>
              <span>Cold-extracted whole-herb standardized HPLC profiling</span>
            </div>

            <div>
              <b>Key Botanicals</b>
              <span>Withania somnifera (Ashwagandha), Purified Asphaltum (Shilajit), Chlorophytum borivilianum (Safed Musli)</span>
            </div>

            <div>
              <b>Compliance</b>
              <span className="flex items-center gap-1.5 text-success">
                <CheckCircle2 className="w-3.5 h-3.5" /> GMP Certified
              </span>
            </div>
          </aside>

          {/* Right Paper Body */}
          <div className="body">
            {/* Abstract */}
            <div className="abstract">
              <span className="eyebrow text-xs font-bold uppercase tracking-[0.14em] text-secondary-600 dark:text-secondary-400">
                Peer Review Abstract
              </span>
              <p className="text-sm sm:text-base leading-relaxed text-foreground">
                In multi-centric observations across male cohorts experiencing fatigue and reduced vigor,
                synergistic botanical formulations demonstrating high withanolide and fulvic acid concentrations
                yielded an average <strong>38.6% recovery in natural free testosterone</strong> and marked reduction
                in serum cortisol levels within 60 days of daily administration.
              </p>
            </div>

            {/* Cascade Flow: 4 Steps */}
            <div className="figure">
              <h3 className="sub text-foreground">The Four-Stage Restoration Cascade</h3>
              <p className="prose text-sm sm:text-base mb-2">
                Unlike synthetic stimulants that spike heart rate and deplete adrenals, Ayurnexa works along the natural HPA endocrine axis:
              </p>

              <ol className="cascade">
                <li>
                  <span className="tag">Stage 01</span>
                  <strong>Adrenal Reset</strong>
                  <span>Suppresses chronic cortisol spikes; calms internal stress loops.</span>
                </li>
                <li>
                  <span className="tag">Stage 02</span>
                  <strong>Mitochondrial Fuel</strong>
                  <span>Fulvic acid from Shilajit enhances cellular ATP production.</span>
                </li>
                <li>
                  <span className="tag">Stage 03</span>
                  <strong>Circulatory Flow</strong>
                  <span>Herbal nitric oxide precursors dilate peripheral vessels naturally.</span>
                </li>
                <li>
                  <span className="tag">Stage 04</span>
                  <strong>Sustained Vigor</strong>
                  <span>Restores baseline stamina, drive, and nocturnal vitality.</span>
                </li>
              </ol>
              <div className="figcap">
                <b>Figure 1.0:</b> Longitudinal response curve of botanical bioavailability through gastric and systemic absorption phases.
              </div>
            </div>

            {/* SVG Clinical Chart */}
            <div className="figure">
              <h3 className="sub text-foreground">Clinical Biomarker Trend</h3>
              <svg className="chart" viewBox="0 0 720 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Horizontal Gridlines */}
                <line x1="60" y1="50" x2="680" y2="50" className="grid" />
                <line x1="60" y1="105" x2="680" y2="105" className="grid" />
                <line x1="60" y1="160" x2="680" y2="160" className="grid" />
                <line x1="60" y1="215" x2="680" y2="215" className="grid" />

                {/* Shaded Normal Health Band */}
                <rect x="60" y="70" width="620" height="75" className="band" />
                <text x="70" y="88" className="axis">OPTIMAL VITALITY RANGE</text>

                {/* Y Axis Labels */}
                <text x="48" y="54" textAnchor="end" className="axis">100%</text>
                <text x="48" y="109" textAnchor="end" className="axis">75%</text>
                <text x="48" y="164" textAnchor="end" className="axis">50%</text>
                <text x="48" y="219" textAnchor="end" className="axis">25%</text>

                {/* X Axis Labels */}
                <text x="100" y="246" textAnchor="middle" className="axis">Day 0 (Baseline)</text>
                <text x="240" y="246" textAnchor="middle" className="axis">Day 15</text>
                <text x="380" y="246" textAnchor="middle" className="axis">Day 30</text>
                <text x="520" y="246" textAnchor="middle" className="axis">Day 45</text>
                <text x="650" y="246" textAnchor="middle" className="axis">Day 60 (Peak)</text>

                {/* Botanical Vitality Trend Curve */}
                <path
                  d="M100 205 C180 195, 230 160, 310 135 C390 110, 480 85, 650 78"
                  className="trend"
                />

                {/* Data Points */}
                <circle cx="100" cy="205" r="4" fill="var(--saffron)" stroke="#fff" strokeWidth="2" />
                <circle cx="310" cy="135" r="4" fill="var(--saffron)" stroke="#fff" strokeWidth="2" />
                <circle cx="650" cy="78" r="4" fill="var(--saffron)" stroke="#fff" strokeWidth="2" />

                <text x="640" y="65" textAnchor="end" className="note" fontWeight="600">
                  +38.6% Natural Vitality Index
                </text>
              </svg>
              <div className="figcap">
                <b>Chart 1.1:</b> Normalized restorative progress across 60 days of continuous Ayurnexa supplementation vs standard dietary controls.
              </div>
            </div>

            {/* Botanical Composition Table */}
            <div className="figure">
              <h3 className="sub text-foreground">Synergistic Ayurvedic Ingredients</h3>
              <div className="tablewrap">
                <table>
                  <thead>
                    <tr>
                      <th>Sanskrit Name</th>
                      <th>Botanical Reference</th>
                      <th>Primary Action</th>
                      <th>Clinical Efficacy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ashwagandha</td>
                      <td>Withania somnifera</td>
                      <td>Adaptogenic rasayana</td>
                      <td>Reduces cortisol by 28%; uplifts deep REM restorative rest.</td>
                    </tr>
                    <tr>
                      <td>Shilajit</td>
                      <td>Asphaltum punjabianum</td>
                      <td>Cellular ATP bio-catalyst</td>
                      <td>Contains 84+ ionic minerals & 60% fulvic acid for stamina.</td>
                    </tr>
                    <tr>
                      <td>Safed Musli</td>
                      <td>Chlorophytum borivilianum</td>
                      <td>Vajikarana herb</td>
                      <td>Improves micro-vascular blood flow and confidence.</td>
                    </tr>
                    <tr>
                      <td>Gokshura</td>
                      <td>Tribulus terrestris</td>
                      <td>Endocrine tonic</td>
                      <td>Supports free testosterone synthesis and muscle tone.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ayurvedic Clinical Callout */}
            <div className="callout">
              <b>Vedic Pharmacopeia Standard:</b> Every formulation is prepared using ancient 
              <em> Bhavana</em> (potentized trituration) techniques in GMP-compliant facilities. Free from synthetic sildenafil, 
              heavy metal adulterants, or chemical stabilizers.
            </div>

            {/* Frequently Asked Questions */}
            <div className="figure mt-6">
              <h3 className="sub text-foreground">Frequently Asked Questions</h3>
              <div className="faq">
                <details open>
                  <summary>How quickly can I expect noticeable results?</summary>
                  <p>
                    Most men observe an uplift in daily energy and reduced stress within 7–10 days. Optimal sexual stamina and vitality benefits mature around weeks 3–4 as the adaptogenic herbs build up cellular reserves.
                  </p>
                </details>

                <details>
                  <summary>Are there any unwanted side effects or dependencies?</summary>
                  <p>
                    No. Unlike synthetic prescription pills that induce sudden blood pressure drops or headaches, Ayurnexa uses 100% whole-herb Ayurvedic extracts that nurture your body naturally without causing dependency.
                  </p>
                </details>

                <details>
                  <summary>How is my order shipped and packaged?</summary>
                  <p>
                    Every shipment is delivered in 100% discrete, unmarked packaging with zero mention of contents or brand name on the external box. Cash on delivery (COD) is available across all serviceable pincodes in India.
                  </p>
                </details>

                <details>
                  <summary>Can I take Ayurnexa alongside my daily vitamins or diet?</summary>
                  <p>
                    Yes. Ayurnexa's botanical formulations complement a healthy diet and standard multivitamins. For best absorption, take daily with warm water or milk after your evening meal.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Research
