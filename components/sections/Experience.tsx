interface TimelineEntry {
  period: string;
  role: string;
  org: string;
  bullets: string[];
  stack: string[];
}

const TIMELINE: TimelineEntry[] = [
  {
    period: "2025 — Now",
    role: "Full Stack Engineer",
    org: "Cora Tech · Casablanca",
    bullets: [
      "Build and ship features across the full stack using React, Next.js, and TailwindCSS.",
      "Refactored core React modules for scalability, performance, and security.",
      "Owns the full release cycle — unit & e2e testing through production deployment.",
    ],
    stack: ["React", "Next.js", "TailwindCSS", "Axios"],
  },
  {
    period: "2023 — 2025",
    role: "Full Stack Engineer",
    org: "TickTickTrader",
    bullets: [
      "Designed and maintained RESTful APIs and gRPC services, replacing REST for optimized data exchange between microservices.",
      "Built high-performance FastAPI services with automatic OpenAPI docs, leveraging Pydantic for robust data validation.",
      "Managed MongoDB and MySQL databases; wrote unit tests for both frontend and backend.",
      "Improved scalability and response times via gRPC bidirectional streaming for high-throughput data operations.",
    ],
    stack: ["React", "Next.js", "NestJS", "FastAPI", "gRPC", "MongoDB", "MySQL"],
  },
  {
    period: "2022 — 2023",
    role: "Full Stack Engineer",
    org: "Freelance",
    bullets: [
      "Developed a music streaming UI — persistent player across all routes, infinite scroll, and album management.",
      "Implemented social sharing and URL-copy features, and drove new feature proposals end-to-end.",
    ],
    stack: ["React", "Next.js", "Node.js"],
  },
  {
    period: "2021 — 2022",
    role: "Full Stack Engineer",
    org: "DevoTech · Agadir",
    bullets: [
      "Translated Figma designs into pixel-perfect React components with Tailwind and Styled Components.",
      "Handled bug triage, unit & e2e testing, and AWS deployments across multiple client projects.",
    ],
    stack: ["React", "Next.js", "TailwindCSS", "AWS"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">

        <div className="reveal mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-mute)]">
          <span>04 — Experience</span>
        </div>

        <h2 className="reveal mb-16 font-[var(--font-heading)] text-3xl font-medium tracking-[-0.02em] md:text-[2.6rem]">
          The{" "}
          <em className="font-[var(--font-serif)] font-normal italic text-[var(--accent)]">
            road
          </em>{" "}
          so far.
        </h2>

        <div className="relative">
          {/* Vertical spine — outside the stagger wrapper so it's always visible */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[22px] top-0 w-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          {/* data-stagger cascades each timeline row in with 80 ms between them */}
          <div data-stagger="130">
          {TIMELINE.map((t, i) => (
            <div
              key={i}
              className="glass relative grid grid-cols-[24px_1fr] gap-4 rounded-2xl px-5 py-6 mb-3 md:grid-cols-[32px_200px_1fr] md:gap-8"
            >
              {/* Dot */}
              <div className="relative z-10">
                <span
                  className="ml-[5px] mt-1.5 block h-3 w-3 rounded-full"
                  style={{
                    background: i === 0 ? "var(--accent)" : "var(--bg)",
                    border: `2px solid ${i === 0 ? "var(--accent)" : "var(--border-strong)"}`,
                    boxShadow: i === 0 ? "0 0 0 6px var(--accent-soft)" : "none",
                  }}
                />
              </div>

              {/* Period + badge */}
              <div>
                <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--fg-mute)]">
                  {t.period}
                </div>
                {i === 0 && (
                  <span className="inline-block rounded-full bg-[var(--accent-soft)] px-2 py-0.5 font-mono text-[10px] tracking-[0.05em] text-[var(--accent)]">
                    ● PRESENT
                  </span>
                )}
              </div>

              {/* Content — col 2 row 2 on mobile, col 3 row 1 on desktop */}
              <div className="col-start-2 mt-3 md:col-auto md:mt-0">
                <h3 className="mb-1 font-[var(--font-heading)] text-2xl font-medium tracking-[-0.02em]">
                  {t.role}
                </h3>
                <div className="mb-3.5 font-[var(--font-serif)] text-[14px] italic text-[var(--fg-dim)]">
                  {t.org}
                </div>
                <ul className="mb-4 grid gap-2">
                  {t.bullets.map((b, k) => (
                    <li
                      key={k}
                      className="relative pl-[18px] text-[15px] leading-[1.55] text-[var(--fg-dim)]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[10px] h-px w-1.5 bg-[var(--fg-mute)]"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {t.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] text-[var(--fg-mute)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          </div>{/* end data-stagger */}
        </div>

        <div className="reveal mt-10">
          <a
            href="/pdf/IDBENOUAKRIM_Mohamed.pdf"
            download="IDBENOUAKRIM_Mohamed.pdf"
            className="glass inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-[13px] text-[var(--fg-dim)] transition-all hover:text-[var(--accent)]"
          >
            Download CV (PDF)
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
