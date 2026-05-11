// No "use client" needed — no hooks, no browser APIs.

// ── Data ─────────────────────────────────────────────────────────────────────
const FACTS = [
  ["Based in",  "Casablanca, MA" ],
  ["Focus",     "Full-stack · Web"],
  ["Open to",   "Remote & hybrid" ],
  ["Languages", "EN · FR · AR"   ],
] as const;

const STATS = [
  ["5+",  "Years shipping"    ],
  ["30+", "Projects delivered"],
  ["12+", "Happy clients"     ],
] as const;

// ── Component ─────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <section id="about" className="py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">

        {/* Section label */}
        <div className="reveal mb-16 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-mute)]">
          <span>01 — About</span>
        </div>

        {/* Two-column grid: photo+facts | bio+stats */}
        {/* data-stagger staggers left column then right column */}
        <div data-stagger="220" className="grid grid-cols-1 items-start gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-20">

          {/* ── Left column ──────────────────────────────────── */}
          <div>

            {/* Photo placeholder */}
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[4px] border border-[var(--border)]"
              style={{
                background:
                  "repeating-linear-gradient(45deg, var(--bg-elev) 0 14px, var(--bg-elev-2) 14px 28px)",
              }}
            >
              {/* Fade-to-bg overlay so the bottom text reads cleanly */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--bg) 80%, transparent) 100%)",
                }}
              />

              {/* Bottom caption */}
              <p className="absolute bottom-5 left-5 right-5 font-mono text-[10px] tracking-[0.05em] text-[var(--fg-mute)]">
                /portrait.jpg — drop your photo here
              </p>

              {/* Top label */}
              <p className="absolute left-5 top-5 font-mono text-[10px] tracking-[0.05em] text-[var(--accent)]">
                MI · 2026
              </p>
            </div>

            {/* Quick-facts table */}
            <dl className="mt-6 grid gap-3 font-mono text-[12px]">
              {FACTS.map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between border-b border-dashed border-[var(--border)] pb-2.5"
                >
                  <dt className="uppercase tracking-[0.05em] text-[var(--fg-mute)]">{key}</dt>
                  <dd className="text-[var(--fg)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Right column ─────────────────────────────────── */}
          <div>

            {/* Section heading */}
            <h2 className="mb-8 font-[var(--font-heading)] text-3xl font-medium leading-tight tracking-tight md:text-[2.6rem]">
              Engineer by craft,{" "}
              <em
                className="font-[var(--font-serif)] font-normal italic text-[var(--accent)]"
                style={{ fontStyle: "italic" }}
              >
                builder
              </em>{" "}
              by instinct.
            </h2>

            {/* Bio paragraphs */}
            <div className="grid max-w-[560px] gap-5 text-[18px] leading-[1.6] text-[var(--fg-dim)]">
              <p>
                I write software the way I&apos;d build a bookshelf — measure twice,
                sand the edges, and make sure it doesn&apos;t wobble. Most of my time is
                spent shipping web apps end-to-end: shaping the data model, sculpting
                the interface, and chasing the last 10ms of perceived performance.
              </p>
              <p>
                I work best in small teams where the line between &ldquo;design&rdquo;
                and &ldquo;engineering&rdquo; is comfortably blurry. I&apos;m equally
                happy debugging a gnarly SQL plan or arguing about button radii.
              </p>
              <p className="text-[var(--fg)]">
                Outside of code: long walks, espresso, and writing about systems that
                quietly work well.
              </p>
            </div>

            {/* Stats row */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {STATS.map(([number, label]) => (
                <div
                  key={label}
                  className="border-t border-[var(--border-strong)] pt-4"
                >
                  <div className="font-[var(--font-heading)] text-[36px] font-medium leading-none tracking-[-0.02em] text-[var(--fg)]">
                    {number}
                  </div>
                  <div className="mt-1 text-[12px] uppercase tracking-[0.05em] text-[var(--fg-mute)]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
