"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────────────── */

function SvgWrap({ children, size = "h-3.5 w-3.5" }: { children: React.ReactNode; size?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
         className={`${size} shrink-0`} aria-hidden="true">
      {children}
    </svg>
  );
}

const GitHubIcon = ({ size }: { size?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={size ?? "h-4 w-4"} aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const CloseIcon = () => (
  <SvgWrap size="h-5 w-5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </SvgWrap>
);

const ArrowIcon = () => (
  <SvgWrap>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </SvgWrap>
);

/* ─────────────────────────────────────────────────────────────────────────────
   INTERFACES & ANIMATION VARIANTS
───────────────────────────────────────────────────────────────────────────── */

interface Feature   { label: string; desc: string }
interface Metric    { label: string; value: string; score: number }
interface Highlight { tag: string; items: string[] }

const ease = [0.22, 1, 0.36, 1] as const;

const FADE_UP = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

const STAGGER = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.065 } },
};

const STAGGER_ITEM = {
  hidden:  { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
};

const BOX_STAGGER = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const BOX_ITEM = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED: MetricRow
───────────────────────────────────────────────────────────────────────────── */

function MetricRow({ label, value, score }: Metric) {
  const ref  = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const pct  = `${(score / 5) * 100}%`;

  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--fg-dim)]">{label}</span>
        <span className="font-mono text-[11px]" style={{ color: "var(--accent)" }}>{value}</span>
      </div>
      <div className="h-[2px] w-full overflow-hidden rounded-full" style={{ background: "var(--border-strong)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--accent)" }}
          initial={{ width: "0%" }}
          animate={inView ? { width: pct } : { width: "0%" }}
          transition={{ duration: 1.1, ease, delay: 0.25 }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED: ModalSectionLabel
───────────────────────────────────────────────────────────────────────────── */

function ModalSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--accent)" }}>
        {children}
      </span>
      <div className="h-px flex-1" style={{ background: "var(--border)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED: ModalBase
───────────────────────────────────────────────────────────────────────────── */

function ModalBase({
  onClose, title, subtitle, children,
}: {
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 md:items-center md:p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease }}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-2xl md:rounded-2xl"
        style={{
          backdropFilter: "blur(56px) saturate(1.8)",
          WebkitBackdropFilter: "blur(56px) saturate(1.8)",
          background: "linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.05) 100%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.22), 0 32px 80px rgba(0,0,0,0.55)",
        }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-7 py-5"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(56px)",
            WebkitBackdropFilter: "blur(56px)",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-mute)]">{subtitle}</span>
            <h2 className="mt-0.5 font-[var(--font-heading)] text-xl font-semibold tracking-[-0.02em]">{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close project details"
            className="flex items-center justify-center rounded-full p-2 text-[var(--fg-dim)] transition-colors hover:text-[var(--fg)]"
            style={{ border: "1px solid var(--border)" }}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="px-7 py-8 space-y-10">{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED: ProjectCard
───────────────────────────────────────────────────────────────────────────── */

function ProjectCard({
  terminalLabel, title, description,
  features, metrics, techStack, highlights,
  githubUrl, onDetails,
}: {
  terminalLabel: string;
  title: string;
  description: string;
  features: Feature[];
  metrics: Metric[];
  techStack: string[];
  highlights: Highlight[];
  githubUrl: string;
  onDetails: () => void;
}) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.7, ease }}
        whileHover={{ y: -3, transition: { duration: 0.3, ease } }}
        className="project-card overflow-hidden rounded-2xl"
        style={{
          backdropFilter: "blur(48px) saturate(1.8)",
          WebkitBackdropFilter: "blur(48px) saturate(1.8)",
          background: "linear-gradient(150deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
          border: "1px solid rgba(255,255,255,0.13)",
          boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.20), 0 24px 64px rgba(0,0,0,0.38), 0 8px 20px rgba(0,0,0,0.22)",
        }}
      >
        {/* Terminal header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: "#ef4444" }} />
            <span className="h-3 w-3 rounded-full" style={{ background: "#f59e0b" }} />
            <span className="h-3 w-3 rounded-full" style={{ background: "#22c55e" }} />
          </div>
          <span className="font-mono text-[12px] text-[var(--fg-mute)]">{terminalLabel}</span>
          <div />
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr]">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="mb-3 font-[var(--font-heading)] text-[1.35rem] font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="text-[14px] leading-[1.72] text-[var(--fg-dim)]">{description}</p>
              </div>

              <div>
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-mute)]">
                  System Quality
                </div>
                <div className="space-y-3.5">
                  {metrics.map((m) => <MetricRow key={m.label} {...m} />)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded border px-4 py-2 font-mono text-[12px] text-[var(--fg-dim)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <GitHubIcon size="h-3.5 w-3.5" />
                  GitHub
                </a>
                <button
                  onClick={onDetails}
                  className="group inline-flex items-center gap-2 rounded px-4 py-2 font-mono text-[12px] transition-opacity hover:opacity-85"
                  style={{ background: "var(--accent)", color: "var(--bg)" }}
                >
                  Architecture Details
                  <span className="transition-transform group-hover:translate-x-0.5">
                    <ArrowIcon />
                  </span>
                </button>
              </div>
            </div>

            {/* Right: feature grid */}
            <div>
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-mute)]">
                Core Features
              </div>
              <motion.div
                variants={STAGGER}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3"
              >
                {features.map((f) => (
                  <motion.div
                    key={f.label}
                    variants={STAGGER_ITEM}
                    className="feature-item rounded-lg p-3"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}
                  >
                    <div className="mb-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                      <span className="text-[12px] font-medium text-[var(--fg)]">{f.label}</span>
                    </div>
                    <p className="text-[11px] leading-[1.55] text-[var(--fg-mute)]">{f.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Tech stack */}
          <div
            className="mt-8 flex flex-wrap items-center gap-2 pt-6"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-mute)]">Stack</span>
            {techStack.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] text-[var(--fg-dim)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
                style={{ border: "1px solid var(--border)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Highlight boxes */}
      <motion.div
        variants={BOX_STAGGER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {highlights.map((h) => (
          <motion.div
            key={h.tag}
            variants={BOX_ITEM}
            whileHover={{ y: -2, transition: { duration: 0.25, ease } }}
            className="highlight-card rounded-xl p-5"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
          >
            <div className="mb-4">
              <span
                className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {h.tag}
              </span>
            </div>
            <ul className="space-y-2">
              {h.items.map((item) => (
                <li key={item} className="relative pl-4 text-[13px] leading-[1.55] text-[var(--fg-dim)]">
                  <span aria-hidden="true" className="absolute left-0 top-[9px] h-px w-2" style={{ background: "var(--fg-mute)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AI SAAS BACKEND — Data
───────────────────────────────────────────────────────────────────────────── */

const AI_FEATURES: Feature[] = [
  { label: "AI Document Chat",       desc: "Natural language queries over documents via RAG" },
  { label: "RAG Pipeline",           desc: "Chunk → embed → store → retrieve → generate loop" },
  { label: "Vector Search",          desc: "Qdrant cosine-similarity search on dense embeddings" },
  { label: "Streaming AI Responses", desc: "SSE token streaming from OpenAI direct to client" },
  { label: "Celery Workers",         desc: "Async task queue for ingestion and AI pipeline jobs" },
  { label: "Redis Caching",          desc: "Distributed LRU cache for embeddings & completions" },
  { label: "JWT Authentication",     desc: "Stateless auth with access + refresh token rotation" },
  { label: "Rate Limiting",          desc: "Per-user AI token budgets and request throttling" },
  { label: "OpenTelemetry Tracing",  desc: "End-to-end traces across API, workers, and AI calls" },
  { label: "Prometheus Metrics",     desc: "AI latency, token usage, pipeline throughput metrics" },
  { label: "Multi-file Upload",      desc: "Parallel ingestion with chunking and batch embedding" },
  { label: "Async Architecture",     desc: "Fully async FastAPI with non-blocking I/O throughout" },
];

const AI_TECH_STACK = [
  "FastAPI", "PostgreSQL", "Redis", "Celery",
  "Qdrant", "OpenAI API", "Docker", "Prometheus",
  "Grafana", "OpenTelemetry", "JWT", "SQLAlchemy", "Nginx",
];

const AI_METRICS: Metric[] = [
  { label: "Scalability",   value: "Distributed",     score: 5 },
  { label: "AI Pipeline",   value: "Optimized",       score: 5 },
  { label: "Architecture",  value: "Modular",         score: 5 },
  { label: "Observability", value: "Full tracing",    score: 5 },
  { label: "Performance",   value: "Async optimized", score: 4 },
];

const AI_HIGHLIGHTS: Highlight[] = [
  {
    tag: "AI Infrastructure",
    items: [
      "Batch embedding with OpenAI text-embedding-3 model",
      "RAG: retrieve top-k chunks → inject into prompt context",
      "Qdrant collections with payload filtering for multi-tenancy",
      "Prompt template engine with token budget enforcement",
    ],
  },
  {
    tag: "Backend Engineering",
    items: [
      "Fully async FastAPI with SQLAlchemy async sessions",
      "Celery + Redis broker for background AI task processing",
      "SSE streaming endpoint that forwards OpenAI token stream",
      "Multi-file parallel ingestion with chunk overlap strategy",
    ],
  },
  {
    tag: "Scalability",
    items: [
      "Stateless API layer — horizontally scalable by default",
      "Celery worker pool auto-scales based on queue depth",
      "Redis Cluster-ready with TTL-based cache eviction",
      "Qdrant collection sharding for vector-at-scale",
    ],
  },
  {
    tag: "Observability",
    items: [
      "AI call latency, token count, and error rate metrics",
      "Traces span: HTTP request → Celery → OpenAI → response",
      "Structured JSON logs with correlation IDs end-to-end",
      "Grafana dashboards pre-built for AI pipeline SLOs",
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   AI SAAS BACKEND — Architecture SVG
───────────────────────────────────────────────────────────────────────────── */

function AISaaSArchDiagram() {
  const s = { fontFamily: "monospace" } as const;
  return (
    <svg viewBox="0 0 530 158" className="w-full" aria-label="AI Backend architecture diagram">
      {/* Row 1: Client → Nginx → FastAPI → OpenAI */}
      <rect x="4" y="30" width="62" height="34" rx="5"
        style={{ fill: "var(--bg-elev-2)", stroke: "var(--border-strong)", strokeWidth: 1 }} />
      <text x="35" y="48" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 9.5 }}>HTTP</text>
      <text x="35" y="60" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 9.5 }}>Client</text>

      <line x1="66" y1="47" x2="92" y2="47" style={{ stroke: "var(--border-strong)", strokeWidth: 1.5 }} />
      <polygon points="92,44 98,47 92,50" style={{ fill: "var(--border-strong)" }} />

      <rect x="98" y="30" width="58" height="34" rx="5"
        style={{ fill: "var(--bg-elev-2)", stroke: "var(--border-strong)", strokeWidth: 1 }} />
      <text x="127" y="51" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 9.5 }}>Nginx</text>

      <line x1="156" y1="47" x2="182" y2="47" style={{ stroke: "var(--accent)", strokeWidth: 1.5 }} />
      <polygon points="182,44 188,47 182,50" style={{ fill: "var(--accent)" }} />

      {/* FastAPI — main box */}
      <rect x="188" y="8" width="118" height="82" rx="8"
        style={{ fill: "var(--accent-soft)", stroke: "var(--accent)", strokeWidth: 1 }} />
      <text x="247" y="28" textAnchor="middle" style={{ ...s, fill: "var(--fg)", fontSize: 11, fontWeight: 600 }}>FastAPI</text>
      <line x1="202" y1="34" x2="292" y2="34" style={{ stroke: "var(--accent)", strokeWidth: 0.5, opacity: 0.4 }} />
      <text x="247" y="50" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 8.5 }}>Async · Auth · Rate</text>
      <text x="247" y="65" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 8.5 }}>Streaming · Routing</text>
      <text x="247" y="80" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 8.5 }}>Metrics · Tracing</text>

      {/* FastAPI → OpenAI */}
      <line x1="306" y1="28" x2="344" y2="28"
        style={{ stroke: "var(--border-strong)", strokeWidth: 1.5, strokeDasharray: "5 3" }} />
      <polygon points="344,25 350,28 344,31" style={{ fill: "var(--border-strong)" }} />
      <rect x="350" y="14" width="80" height="30" rx="5"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border-strong)", strokeWidth: 1 }} />
      <text x="390" y="33" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 9 }}>OpenAI API</text>

      {/* FastAPI → Redis + Celery (down arrows) */}
      <line x1="220" y1="90" x2="220" y2="108"
        style={{ stroke: "var(--border-strong)", strokeWidth: 1, strokeDasharray: "3 2" }} />
      <line x1="265" y1="90" x2="265" y2="108"
        style={{ stroke: "var(--border-strong)", strokeWidth: 1, strokeDasharray: "3 2" }} />

      {/* Row 2: Redis | Celery → Qdrant | PostgreSQL */}
      <rect x="188" y="110" width="62" height="28" rx="5"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border)", strokeWidth: 1 }} />
      <text x="219" y="128" textAnchor="middle" style={{ ...s, fill: "var(--fg-mute)", fontSize: 9 }}>Redis</text>

      <rect x="260" y="110" width="72" height="28" rx="5"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border)", strokeWidth: 1 }} />
      <text x="296" y="128" textAnchor="middle" style={{ ...s, fill: "var(--fg-mute)", fontSize: 9 }}>Celery Workers</text>

      <line x1="332" y1="124" x2="350" y2="124" style={{ stroke: "var(--border)", strokeWidth: 1.5 }} />
      <polygon points="350,121 356,124 350,127" style={{ fill: "var(--border-strong)" }} />

      <rect x="356" y="104" width="72" height="28" rx="5"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border)", strokeWidth: 1 }} />
      <text x="392" y="122" textAnchor="middle" style={{ ...s, fill: "var(--fg-mute)", fontSize: 9 }}>Qdrant VDB</text>

      <rect x="356" y="138" width="72" height="26" rx="5"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border)", strokeWidth: 1 }} />
      <text x="392" y="154" textAnchor="middle" style={{ ...s, fill: "var(--fg-mute)", fontSize: 9 }}>PostgreSQL</text>

      {/* Observability (right column, dashed) */}
      <rect x="444" y="14" width="80" height="24" rx="4"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border)", strokeWidth: 1 }} />
      <text x="484" y="30" textAnchor="middle" style={{ ...s, fill: "var(--fg-mute)", fontSize: 8.5 }}>Prometheus</text>

      <rect x="444" y="50" width="80" height="24" rx="4"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border)", strokeWidth: 1 }} />
      <text x="484" y="66" textAnchor="middle" style={{ ...s, fill: "var(--fg-mute)", fontSize: 8.5 }}>Grafana</text>

      <rect x="444" y="86" width="80" height="24" rx="4"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border)", strokeWidth: 1 }} />
      <text x="484" y="102" textAnchor="middle" style={{ ...s, fill: "var(--fg-mute)", fontSize: 8.5 }}>OTLP / Jaeger</text>

      <line x1="306" y1="40" x2="444" y2="26"
        style={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 3" }} />
      <line x1="306" y1="55" x2="444" y2="62"
        style={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 3" }} />
      <line x1="306" y1="70" x2="444" y2="98"
        style={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 3" }} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AI SAAS BACKEND — Modal
───────────────────────────────────────────────────────────────────────────── */

function AISaaSModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalBase onClose={onClose} title="AI Backend Platform" subtitle="Project deep-dive">

      {/* Overview */}
      <section>
        <ModalSectionLabel>Overview</ModalSectionLabel>
        <p className="mt-3 text-[15px] leading-[1.7] text-[var(--fg-dim)]">
          A scalable AI backend built with FastAPI that enables intelligent document chat through a
          full RAG (Retrieval-Augmented Generation) pipeline. The system handles document ingestion,
          vector embedding, semantic search, and streaming AI responses — all designed for multi-tenant
          multi-tenant workloads with full observability and async-first architecture.
        </p>
      </section>

      {/* Architecture */}
      <section>
        <ModalSectionLabel>System Architecture</ModalSectionLabel>
        <p className="mt-3 mb-6 text-[14px] leading-[1.65] text-[var(--fg-dim)]">
          Requests enter via Nginx (TLS termination, rate-limit headers), hit the async FastAPI service,
          then fan out to Redis (cache), Celery (background work), Qdrant (vector ops), PostgreSQL (relational
          state), and OpenAI (inference). All layers emit OpenTelemetry spans that flow to a Jaeger collector.
        </p>
        <div
          className="overflow-hidden rounded-lg p-4"
          style={{ border: "1px solid var(--border)", background: "var(--bg-elev)" }}
        >
          <AISaaSArchDiagram />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { layer: "API Layer",           desc: "Async FastAPI with Pydantic validation, JWT auth middleware, rate-limit hooks" },
            { layer: "AI Pipeline Layer",   desc: "RAG orchestrator: retrieve → re-rank → augment → stream generation" },
            { layer: "Worker Layer",        desc: "Celery tasks: document ingestion, embedding batches, async AI jobs" },
            { layer: "Storage Layer",       desc: "Qdrant (vectors), PostgreSQL (metadata + users), Redis (cache + broker)" },
          ].map((l) => (
            <div key={l.layer} className="rounded-md p-3.5" style={{ border: "1px solid var(--border)", background: "var(--bg-elev)" }}>
              <div className="mb-1 font-mono text-[11px] font-medium text-[var(--fg)]">{l.layer}</div>
              <div className="text-[13px] leading-[1.5] text-[var(--fg-dim)]">{l.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RAG Pipeline */}
      <section>
        <ModalSectionLabel>RAG Pipeline Breakdown</ModalSectionLabel>
        <div className="mt-3 space-y-3">
          {[
            { step: "1 · Ingestion",   detail: "Files uploaded, Celery task splits into overlapping chunks (512 tokens, 64-token overlap) via LangChain TextSplitter." },
            { step: "2 · Embedding",   detail: "Each chunk embedded with OpenAI text-embedding-3-small in batches of 100. Vectors stored in Qdrant with document ID payload." },
            { step: "3 · Retrieval",   detail: "User query embedded, top-k (default: 6) chunks retrieved by cosine similarity with Qdrant's HNSW index." },
            { step: "4 · Augmentation",detail: "Retrieved chunks injected into a system prompt template. Token budget enforced — context truncated to fit within model limit." },
            { step: "5 · Generation",  detail: "OpenAI chat completion called with stream=True. Server-Sent Events forward each token delta directly to the client as it arrives." },
          ].map((item) => (
            <div key={item.step} className="rounded-lg p-4" style={{ border: "1px solid var(--border)", background: "var(--bg-elev)" }}>
              <div className="mb-1 font-mono text-[11px] font-semibold" style={{ color: "var(--accent)" }}>{item.step}</div>
              <p className="text-[13px] leading-[1.6] text-[var(--fg-dim)]">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Async & Worker architecture */}
      <section>
        <ModalSectionLabel>Async Architecture &amp; Worker System</ModalSectionLabel>
        <ul className="mt-3 space-y-3">
          {[
            { t: "FastAPI async endpoints", d: "All endpoints are async def with async SQLAlchemy sessions — no thread blocking on DB or HTTP calls." },
            { t: "Celery task routing",     d: "Separate queues for ingestion (CPU-bound chunking) and AI jobs (I/O-bound OpenAI calls) — different concurrency settings per queue." },
            { t: "Redis as broker + cache", d: "Redis serves dual purpose: Celery message broker and LRU cache for repeated embeddings and completion results." },
            { t: "Task result backend",     d: "Celery stores task state in Redis; clients poll /tasks/{id} or receive push via SSE progress stream." },
            { t: "Graceful worker shutdown",d: "SIGTERM triggers warm_shutdown: in-flight tasks complete, new tasks rejected, then worker exits cleanly." },
          ].map((item) => (
            <li key={item.t} className="flex gap-3">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
              <div>
                <span className="font-medium text-[14px] text-[var(--fg)]">{item.t}: </span>
                <span className="text-[14px] leading-[1.6] text-[var(--fg-dim)]">{item.d}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Engineering decisions */}
      <section>
        <ModalSectionLabel>Engineering Decisions</ModalSectionLabel>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { d: "FastAPI over Django",       r: "Native async support, automatic OpenAPI docs, Pydantic validation, and < 1 ms overhead vs Django ORM sync" },
            { d: "Qdrant over Pinecone",       r: "Self-hosted, no per-vector pricing, payload filtering for multi-tenancy, HNSW tunable per collection" },
            { d: "SSE over WebSockets",        r: "One-way token stream needs SSE semantics — simpler than WS, works through HTTP/2, no keep-alive complexity" },
            { d: "Chunk overlap strategy",     r: "64-token overlap preserves sentence context across chunk boundaries — reduces hallucination on split passages" },
            { d: "Redis dual-role",            r: "Single Redis instance as both Celery broker and completion cache simplifies ops; separate DBs isolate data" },
            { d: "Async SQLAlchemy",           r: "asyncpg driver + SQLAlchemy 2.0 async ORM yields 3× throughput vs sync psycopg2 under concurrent load" },
          ].map((c) => (
            <div key={c.d} className="rounded-md p-3.5" style={{ border: "1px solid var(--border)", background: "var(--bg-elev)" }}>
              <div className="mb-1 font-mono text-[11px] font-semibold" style={{ color: "var(--accent)" }}>{c.d}</div>
              <div className="text-[13px] leading-[1.5] text-[var(--fg-dim)]">{c.r}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack table */}
      <section>
        <ModalSectionLabel>Technology Breakdown</ModalSectionLabel>
        <div className="mt-3 overflow-hidden rounded-lg" style={{ border: "1px solid var(--border)" }}>
          {[
            { tech: "FastAPI",        role: "Async API framework — endpoints, middleware, dependency injection, SSE" },
            { tech: "Qdrant",         role: "Vector database — HNSW index, cosine similarity, payload filtering" },
            { tech: "OpenAI API",     role: "Embedding (text-embedding-3) and chat completion (gpt-4o) with streaming" },
            { tech: "Celery",         role: "Distributed task queue for ingestion, embedding, and AI pipeline jobs" },
            { tech: "Redis",          role: "Message broker for Celery + LRU cache for embeddings and completions" },
            { tech: "PostgreSQL",     role: "Relational store: users, documents, chat history, API key registry" },
            { tech: "SQLAlchemy",     role: "Async ORM with asyncpg driver — migrations via Alembic" },
            { tech: "Prometheus",     role: "Metrics: AI latency histograms, token counts, pipeline error rate" },
            { tech: "OpenTelemetry",  role: "Distributed tracing SDK — spans across FastAPI, Celery, OpenAI calls" },
            { tech: "Nginx",          role: "Reverse proxy, TLS, upstream load balancing, buffering SSE streams" },
            { tech: "Docker",         role: "Multi-stage build, docker-compose with full observability stack" },
          ].map((row, i, arr) => (
            <div
              key={row.tech}
              className="flex items-start gap-4 px-4 py-3"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              <span className="mt-0.5 w-28 shrink-0 font-mono text-[12px] font-medium" style={{ color: "var(--accent)" }}>
                {row.tech}
              </span>
              <span className="text-[13px] leading-[1.55] text-[var(--fg-dim)]">{row.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Future improvements */}
      <section>
        <ModalSectionLabel>Planned Improvements</ModalSectionLabel>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            "Hybrid search: combine dense + sparse (BM25) retrieval",
            "Multi-modal: PDF with image region extraction",
            "Re-ranking layer with cross-encoder model",
            "Streaming Celery progress via Redis pub/sub + SSE",
            "Self-hosted embedding model (sentence-transformers)",
            "AI cost accounting per tenant per request",
            "LangGraph-based agentic pipeline support",
            "Kubernetes Helm chart + HPA for worker auto-scale",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-[13px] text-[var(--fg-dim)]">
              <span className="h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--fg-mute)" }} />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="flex flex-wrap gap-3 pt-2 pb-2">
        <a
          href="https://github.com/devloopcode/fastapi-ai-service"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded border px-5 py-2.5 font-mono text-[13px] text-[var(--fg-dim)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          style={{ border: "1px solid var(--border-strong)" }}
        >
          <GitHubIcon size="h-4 w-4" />
          View on GitHub
        </a>
      </div>

    </ModalBase>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GO API GATEWAY — Data
───────────────────────────────────────────────────────────────────────────── */

const GW_FEATURES: Feature[] = [
  { label: "Reverse Proxy",      desc: "Transparent forwarding with upstream header injection" },
  { label: "JWT Authentication", desc: "Stateless auth with RS256/HS256 signing & key rotation" },
  { label: "Rate Limiting",      desc: "Redis-backed distributed token bucket — per client IP" },
  { label: "Load Balancing",     desc: "Round-robin & weighted strategies across upstreams" },
  { label: "Circuit Breaker",    desc: "Hystrix-pattern fault isolation with half-open recovery" },
  { label: "OpenTelemetry",      desc: "Distributed traces via W3C TraceContext propagation" },
  { label: "Prometheus Metrics", desc: "RED metrics (rate, errors, duration) exported per route" },
  { label: "Docker Deployment",  desc: "Multi-stage alpine build — image < 20 MB at runtime" },
  { label: "Clean Architecture", desc: "Domain, application & infrastructure layers enforced" },
  { label: "Middleware Chain",   desc: "Composable handler pipeline with context propagation" },
  { label: "Graceful Shutdown",  desc: "SIGTERM handler drains all in-flight requests safely" },
  { label: "Request Tracing",    desc: "Correlation IDs injected at edge, logged end-to-end" },
];

const GW_TECH_STACK = [
  "Go", "Redis", "Docker", "Prometheus",
  "Grafana", "OpenTelemetry", "JWT", "Gin", "PostgreSQL",
];

const GW_METRICS: Metric[] = [
  { label: "Scalability",   value: "High",            score: 5 },
  { label: "Performance",   value: "Optimized",       score: 4 },
  { label: "Security",      value: "Battle-hardened", score: 5 },
  { label: "Observability", value: "Full tracing",    score: 5 },
  { label: "Resilience",    value: "Circuit-broken",  score: 4 },
];

const GW_HIGHLIGHTS: Highlight[] = [
  {
    tag: "Architecture",
    items: [
      "Clean architecture with strict layer boundaries",
      "Domain-driven design & interface abstractions",
      "Dependency injection for testability",
      "Middleware composability via handler chains",
    ],
  },
  {
    tag: "Performance",
    items: [
      "Sub-millisecond gateway overhead per hop",
      "Zero-allocation hot path in core router",
      "Connection pooling to all upstream services",
      "Goroutine worker pools for high I/O throughput",
    ],
  },
  {
    tag: "Scalability",
    items: [
      "Stateless design — horizontally scalable by default",
      "Redis Cluster-ready distributed rate limiter",
      "Health-check-aware load balancer routing",
      "Dynamic upstream registration without restart",
    ],
  },
  {
    tag: "Infrastructure",
    items: [
      "Multi-stage Docker build with alpine runtime",
      "Prometheus metrics + Grafana dashboards included",
      "OpenTelemetry collector sidecar pattern",
      "docker-compose for full local observability stack",
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   GO API GATEWAY — Architecture SVG
───────────────────────────────────────────────────────────────────────────── */

function GatewayArchDiagram() {
  const s = { fontFamily: "monospace" } as const;
  return (
    <svg viewBox="0 0 520 130" className="w-full" aria-label="API Gateway architecture diagram">
      <rect x="4" y="45" width="68" height="40" rx="6"
        style={{ fill: "var(--bg-elev-2)", stroke: "var(--border-strong)", strokeWidth: 1 }} />
      <text x="38" y="63" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 10 }}>HTTP</text>
      <text x="38" y="77" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 10 }}>Client</text>

      <line x1="72" y1="65" x2="110" y2="65" style={{ stroke: "var(--accent)", strokeWidth: 1.5 }} />
      <polygon points="110,62 116,65 110,68" style={{ fill: "var(--accent)" }} />

      <rect x="116" y="14" width="166" height="102" rx="8"
        style={{ fill: "var(--accent-soft)", stroke: "var(--accent)", strokeWidth: 1 }} />
      <text x="199" y="34" textAnchor="middle" style={{ ...s, fill: "var(--fg)", fontSize: 11.5, fontWeight: 600 }}>API Gateway</text>
      <line x1="130" y1="40" x2="268" y2="40" style={{ stroke: "var(--accent)", strokeWidth: 0.5, opacity: 0.4 }} />
      <text x="199" y="56" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 9 }}>Auth · Rate Limit · Circuit</text>
      <text x="199" y="72" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 9 }}>Load Balance · Reverse Proxy</text>
      <text x="199" y="88" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 9 }}>Trace · Metrics · Shutdown</text>

      <line x1="282" y1="65" x2="320" y2="65" style={{ stroke: "var(--accent)", strokeWidth: 1.5 }} />
      <polygon points="320,62 326,65 320,68" style={{ fill: "var(--accent)" }} />

      <rect x="326" y="45" width="80" height="40" rx="6"
        style={{ fill: "var(--bg-elev-2)", stroke: "var(--border-strong)", strokeWidth: 1 }} />
      <text x="366" y="63" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 9.5 }}>Backend</text>
      <text x="366" y="77" textAnchor="middle" style={{ ...s, fill: "var(--fg-dim)", fontSize: 9.5 }}>Services</text>

      <rect x="420" y="10" width="90" height="28" rx="5"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border)", strokeWidth: 1 }} />
      <text x="465" y="28" textAnchor="middle" style={{ ...s, fill: "var(--fg-mute)", fontSize: 9 }}>Prometheus</text>
      <rect x="420" y="50" width="90" height="28" rx="5"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border)", strokeWidth: 1 }} />
      <text x="465" y="68" textAnchor="middle" style={{ ...s, fill: "var(--fg-mute)", fontSize: 9 }}>Grafana</text>
      <rect x="420" y="90" width="90" height="28" rx="5"
        style={{ fill: "var(--bg-elev)", stroke: "var(--border)", strokeWidth: 1 }} />
      <text x="465" y="108" textAnchor="middle" style={{ ...s, fill: "var(--fg-mute)", fontSize: 9 }}>Jaeger / OTLP</text>

      <line x1="282" y1="42" x2="420" y2="24" style={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 3" }} />
      <line x1="282" y1="65" x2="420" y2="64" style={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 3" }} />
      <line x1="282" y1="88" x2="420" y2="104" style={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 3" }} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GO API GATEWAY — Modal
───────────────────────────────────────────────────────────────────────────── */

function GatewayModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalBase onClose={onClose} title="Go API Gateway" subtitle="Project deep-dive">

      <section>
        <ModalSectionLabel>Overview</ModalSectionLabel>
        <p className="mt-3 text-[15px] leading-[1.7] text-[var(--fg-dim)]">
          An API Gateway built in Go that acts as the single entry point for a microservice
          architecture. It handles cross-cutting concerns — authentication, rate limiting, observability,
          and traffic management — so individual services stay focused on business logic. Designed from the
          ground up for high throughput, fault tolerance, and operational visibility.
        </p>
      </section>

      <section>
        <ModalSectionLabel>Technical Architecture</ModalSectionLabel>
        <p className="mt-3 mb-6 text-[14px] leading-[1.65] text-[var(--fg-dim)]">
          Each inbound HTTP request traverses an ordered middleware pipeline before reaching the upstream
          proxy. Middleware is composable and context-aware — upstream metadata, authenticated claims,
          and trace context all propagate via Go&apos;s{" "}
          <code className="font-mono text-[13px]" style={{ color: "var(--accent)" }}>context.Context</code>.
        </p>
        <div className="overflow-hidden rounded-lg p-4" style={{ border: "1px solid var(--border)", background: "var(--bg-elev)" }}>
          <GatewayArchDiagram />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { layer: "Domain Layer",         desc: "Gateway config, upstream registry, auth contracts, rate-limit rules" },
            { layer: "Application Layer",    desc: "Middleware pipeline, request lifecycle, circuit-breaker state machine" },
            { layer: "Infrastructure Layer", desc: "Redis adapter, Prometheus exporter, OTLP exporter, DB repository" },
            { layer: "Transport Layer",      desc: "Gin HTTP server, graceful shutdown listener, health endpoints" },
          ].map((l) => (
            <div key={l.layer} className="rounded-md p-3.5" style={{ border: "1px solid var(--border)", background: "var(--bg-elev)" }}>
              <div className="mb-1 font-mono text-[11px] font-medium text-[var(--fg)]">{l.layer}</div>
              <div className="text-[13px] leading-[1.5] text-[var(--fg-dim)]">{l.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <ModalSectionLabel>Engineering Decisions</ModalSectionLabel>
        <ul className="mt-3 space-y-3">
          {[
            { d: "Go over Node.js",           r: "Goroutines provide M:N threading at near-zero cost — ideal for a proxy that spends most of its time waiting on I/O." },
            { d: "Redis for rate limiting",    r: "Atomic INCR + EXPIRY makes Redis the natural choice for distributed, consistent counters without a coordination service." },
            { d: "Token-bucket algorithm",     r: "Allows burst traffic to flow through while enforcing a sustained rate — better UX for API clients that batch requests." },
            { d: "OpenTelemetry SDK",          r: "Vendor-neutral instrumentation — the collector can export to Jaeger, Zipkin, or any cloud backend without code changes." },
            { d: "Half-open circuit breaker",  r: "Avoids permanently blacklisting a recovered upstream — a single probe tests availability before full traffic resumes." },
            { d: "Multi-stage Docker build",   r: "Builder stage compiles the binary; runtime is bare alpine (~7 MB) with only the binary — zero toolchain in prod." },
          ].map((item) => (
            <li key={item.d} className="flex gap-3">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
              <div>
                <span className="font-medium text-[14px] text-[var(--fg)]">{item.d}: </span>
                <span className="text-[14px] leading-[1.6] text-[var(--fg-dim)]">{item.r}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <ModalSectionLabel>Distributed Systems Concepts Applied</ModalSectionLabel>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { concept: "Fault Tolerance",      detail: "Circuit breakers prevent cascade failures; retries with exponential backoff for transient errors" },
            { concept: "Backpressure",          detail: "Rate limiter applies backpressure at the edge, protecting downstream services from traffic spikes" },
            { concept: "Observability Triad",   detail: "Metrics, traces, and structured logs — all correlated via trace and request IDs" },
            { concept: "Idempotent Shutdown",   detail: "SIGTERM triggers a draining period: new connections refused, in-flight requests complete, then exit" },
            { concept: "Context Propagation",   detail: "Trace context and auth claims flow through context.Context — no global state, goroutine-safe" },
            { concept: "Health-based Routing",  detail: "Load balancer checks upstream /health probes and removes unhealthy nodes from rotation" },
          ].map((c) => (
            <div key={c.concept} className="rounded-md p-3.5" style={{ border: "1px solid var(--border)", background: "var(--bg-elev)" }}>
              <div className="mb-1 font-mono text-[11px] font-semibold" style={{ color: "var(--accent)" }}>{c.concept}</div>
              <div className="text-[13px] leading-[1.5] text-[var(--fg-dim)]">{c.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <ModalSectionLabel>Technology Breakdown</ModalSectionLabel>
        <div className="mt-3 overflow-hidden rounded-lg" style={{ border: "1px solid var(--border)" }}>
          {[
            { tech: "Go",            role: "Core runtime — goroutines, standard library HTTP, context propagation" },
            { tech: "Gin",           role: "HTTP framework — fast router, middleware support, request binding" },
            { tech: "Redis",         role: "Distributed rate-limit counters, session cache" },
            { tech: "Prometheus",    role: "Metrics collection, scraped by Prometheus server, visualised in Grafana" },
            { tech: "OpenTelemetry", role: "Distributed tracing SDK — exports to Jaeger via OTLP gRPC" },
            { tech: "Docker",        role: "Multi-stage build, docker-compose for local full-stack observability" },
            { tech: "JWT",           role: "Stateless auth tokens verified in the gateway, claims passed to upstreams" },
            { tech: "PostgreSQL",    role: "Upstream registry persistence, API key store" },
          ].map((row, i, arr) => (
            <div
              key={row.tech}
              className="flex items-start gap-4 px-4 py-3"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              <span className="mt-0.5 w-28 shrink-0 font-mono text-[12px] font-medium" style={{ color: "var(--accent)" }}>{row.tech}</span>
              <span className="text-[13px] leading-[1.55] text-[var(--fg-dim)]">{row.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <ModalSectionLabel>Planned Improvements</ModalSectionLabel>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            "gRPC reverse proxy with HTTP/JSON transcoding",
            "WebSocket connection proxying",
            "mTLS for upstream service-to-service auth",
            "WASM plugin system for custom middleware",
            "Admin REST API for live config reload",
            "Request/response transformation rules",
            "Canary & blue-green routing support",
            "Persistent rate-limit quotas with PostgreSQL",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-[13px] text-[var(--fg-dim)]">
              <span className="h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--fg-mute)" }} />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 pt-2 pb-2">
        <a
          href="https://github.com/devloopcode/api-gateway"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded border px-5 py-2.5 font-mono text-[13px] text-[var(--fg-dim)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          style={{ border: "1px solid var(--border-strong)" }}
        >
          <GitHubIcon size="h-4 w-4" />
          View on GitHub
        </a>
      </div>

    </ModalBase>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────────────────────────────────────── */

export default function Projects() {
  const [aiModal, setAiModal] = useState(false);
  const [gwModal, setGwModal] = useState(false);

  return (
    <section id="projects" className="py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">

        {/* Header */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          className="mb-16"
        >
          <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-mute)]">
            02 — Work
          </div>
          <h2 className="mb-4 font-[var(--font-heading)] text-3xl font-medium tracking-[-0.02em] md:text-[2.6rem]">
            Systems built to{" "}
            <em className="font-[var(--font-serif)] font-normal italic text-[var(--accent)]">scale.</em>
          </h2>
          <p className="max-w-xl text-[15px] leading-[1.7] text-[var(--fg-dim)]">
            Backend engineering with a focus on distributed systems, AI infrastructure,
            and fault-tolerant architecture.
          </p>
        </motion.div>

        {/* AI SaaS Backend */}
        <div className="mb-10">
          <ProjectCard
            terminalLabel="ai-saas-backend / main.py"
            title="AI Backend Platform"
            description="A scalable AI backend using FastAPI featuring AI document chat, vector search, RAG pipelines, Redis caching, Celery workers, streaming AI responses, async architecture, and full observability."
            features={AI_FEATURES}
            metrics={AI_METRICS}
            techStack={AI_TECH_STACK}
            highlights={AI_HIGHLIGHTS}
            githubUrl="https://github.com/devloopcode/fastapi-ai-service"
            onDetails={() => setAiModal(true)}
          />
        </div>

        {/* Divider */}
        <div className="my-10 flex items-center gap-4">
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-mute)]">
            Also built
          </span>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>

        {/* Go API Gateway */}
        <ProjectCard
          terminalLabel="api-gateway / main.go"
          title="Go API Gateway"
          description="An API Gateway in Go featuring reverse proxying, JWT authentication, Redis-based distributed rate limiting, load balancing, circuit breakers, OpenTelemetry tracing, and Prometheus metrics — built on clean architecture principles."
          features={GW_FEATURES}
          metrics={GW_METRICS}
          techStack={GW_TECH_STACK}
          highlights={GW_HIGHLIGHTS}
          githubUrl="https://github.com/devloopcode/api-gateway"
          onDetails={() => setGwModal(true)}
        />

      </div>

      {/* Modals */}
      <AnimatePresence>
        {aiModal && <AISaaSModal onClose={() => setAiModal(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {gwModal && <GatewayModal onClose={() => setGwModal(false)} />}
      </AnimatePresence>
    </section>
  );
}
