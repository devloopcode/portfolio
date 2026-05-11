// ── Data ─────────────────────────────────────────────────────────────────────
const SKILL_GROUPS = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Go", "SQL"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind", "Framer Motion", "Vite"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express", "Fastify", "NestJS", "GraphQL", "tRPC", "REST", "FastAPI"],
  },
  // {
  //   label: "Data & Infra",
  //   items: ["Postgres", "Redis", "MongoDB", "Docker", "AWS", "Vercel", "GitHub Actions"],
  // },
  // {
  //   label: "Tooling",
  //   items: ["Figma", "Linear", "Notion", "Vitest", "Playwright", "Storybook"],
  // },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────
export default function Skills() {
  return (
    <section
      id="skills"
      className="border-y border-[var(--border)] bg-[var(--bg-elev)] py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">

        {/* Section label */}
        <div className="reveal mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-mute)]">
          <span>03 — Stack</span>
        </div>

        {/* Section title */}
        <h2 className="reveal mb-16 font-[var(--font-heading)] text-3xl font-medium leading-tight tracking-tight md:text-[2.6rem]">
          Tools I{" "}
          <em
            className="font-[var(--font-serif)] font-normal italic text-[var(--accent)]"
            style={{ fontStyle: "italic" }}
          >
            reach for
          </em>
          .
        </h2>

        {/*
          Card grid — 1px gap + bg-[var(--border)] on the wrapper creates
          the hairline-border illusion between cards without any border on the cards.
          Columns: 1 on mobile → 2 from sm → 3 from 900px.
        */}
        {/* data-stagger cascades each card in with 90 ms between them */}
        <div
          data-stagger="140"
          className={[
            "grid gap-px",
            "bg-[var(--border)] border border-[var(--border)]",
            "grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-3",
          ].join(" ")}
        >
          {SKILL_GROUPS.map((group, i) => (
            <div
              key={group.label}
              className={[
                "flex min-h-[240px] flex-col gap-4",
                "bg-[var(--bg)] px-7 py-8",
              ].join(" ")}
            >
              {/* Card header — index + accent dot */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--fg-mute)]">
                  0{i + 1}
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent-soft)]"
                />
              </div>

              {/* Category label */}
              <h3 className="font-[var(--font-heading)] text-[22px] font-medium tracking-[-0.02em]">
                {group.label}
              </h3>

              {/* Skill chips — pushed to bottom via mt-auto */}
              <ul className="mt-auto flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={[
                      "cursor-default rounded-[4px] border px-2.5 py-1.5",
                      "font-mono text-[11px]",
                      "border-[var(--border-strong)] text-[var(--fg-dim)]",
                      "transition-all duration-200",
                      "hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]",
                    ].join(" ")}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Currently learning footer */}
        <div className="reveal mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[6px] border border-dashed border-[var(--border-strong)] px-7 py-6">
          {/* <p className="font-mono text-[13px] text-[var(--fg-dim)]">
            <span className="text-[var(--accent)]">{">"}</span>{" "}
            Currently learning:{" "}
            <span className="text-[var(--fg)]">
              Rust async runtimes, edge computing, WASM
            </span>
          </p> */}
          <span className="font-mono text-[11px] text-(--fg-dim)">
            Always shipping ~ always learning
          </span>
        </div>
      </div>
    </section>
  );
}
