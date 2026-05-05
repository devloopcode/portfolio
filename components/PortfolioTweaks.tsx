"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";

// ── Defaults (exported so AppShell can seed particle density) ─────────────────
export const TWEAK_DEFAULTS = {
  theme:           "dark"  as "dark" | "light",
  accent:          "amber" as "amber" | "lime" | "cyan" | "violet" | "coral",
  headingFont:     "geist" as "geist" | "serif" | "inter",
  cursor:          true    as boolean,
  showGrain:       false   as boolean,
  particleDensity: 80,
};

type Tweaks = typeof TWEAK_DEFAULTS;

// Generic setter: setT('theme', 'dark') is typed correctly
type SetOneTweak = <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;

// ── useTweaks hook ────────────────────────────────────────────────────────────
// Keeps local state and broadcasts every change so AppShell (Hero density)
// can react without prop-drilling through the full tree.
function useTweaks(defaults: Tweaks): [Tweaks, SetOneTweak] {
  const [state, setState] = useState<Tweaks>(defaults);

  const setOne: SetOneTweak = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
    window.postMessage(
      { type: "__tweaks_internal_changed", edits: { [key]: value } },
      "*"
    );
  };

  return [state, setOne];
}

// ── Static data ───────────────────────────────────────────────────────────────
const ACCENT_SWATCHES = [
  { id: "amber",  color: "oklch(0.82 0.16 80)"  },
  { id: "lime",   color: "oklch(0.86 0.18 130)" },
  { id: "cyan",   color: "oklch(0.82 0.13 210)" },
  { id: "violet", color: "oklch(0.78 0.16 295)" },
  { id: "coral",  color: "oklch(0.78 0.17 25)"  },
] as const;

// SVG feTurbulence encoded as data URI for the film grain overlay
const GRAIN_BG = [
  "url(\"data:image/svg+xml,",
  "%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E",
  "%3Cfilter id='n'%3E",
  "%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E",
  "%3C/filter%3E",
  "%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E",
  "%3C/svg%3E\")",
].join("");

// ── Icons ─────────────────────────────────────────────────────────────────────
function SlidersIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="8"  cy="6"  r="2.25" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="2.25" fill="currentColor" stroke="none" />
      <circle cx="10" cy="18" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// ── Panel shell ───────────────────────────────────────────────────────────────
function TweaksPanel({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2">

      {/* Floating panel — scale + fade when toggled */}
      <div
        role="dialog"
        aria-label="Portfolio tweaks"
        aria-hidden={!open}
        className={[
          "w-72 overflow-hidden rounded-2xl",
          "border border-[var(--border)] bg-[var(--bg-elev)]",
          "shadow-[0_8px_40px_rgba(0,0,0,0.22)]",
          "origin-bottom-right transition-all duration-200",
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-mute)]">
            {title}
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close tweaks panel"
            className="flex h-5 w-5 items-center justify-center rounded text-[var(--fg-mute)] transition-colors hover:text-[var(--fg)]"
          >
            <XIcon />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="max-h-[70vh] divide-y divide-[var(--border)] overflow-y-auto">
          {children}
        </div>
      </div>

      {/* FAB toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle tweaks panel"
        aria-expanded={open}
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full",
          "border border-[var(--border)] bg-[var(--bg-elev)]",
          "shadow-[0_4px_16px_rgba(0,0,0,0.16)]",
          "transition-all duration-200",
          "hover:border-[var(--accent)] hover:text-[var(--accent)]",
          open
            ? "border-[var(--accent)] text-[var(--accent)]"
            : "text-[var(--fg-mute)]",
        ].join(" ")}
      >
        <SlidersIcon />
      </button>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
function TweakSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-4 py-3.5">
      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--fg-mute)]">
        {title}
      </p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

// ── Row (label + control) ─────────────────────────────────────────────────────
function TweakRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[11px] text-[var(--fg-dim)]">{label}</span>
      {children}
    </div>
  );
}

// ── Segmented radio ───────────────────────────────────────────────────────────
interface TweakRadioProps {
  label:    string;
  value:    string;
  options:  { value: string; label: string }[];
  onChange: (v: string) => void;
}

function TweakRadio({ label, value, options, onChange }: TweakRadioProps) {
  return (
    <TweakRow label={label}>
      <div className="flex overflow-hidden rounded-[4px] border border-[var(--border-strong)]">
        {options.map((opt, i) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              "px-3 py-1 font-mono text-[10px] uppercase tracking-[0.04em]",
              "transition-colors duration-150",
              i > 0 ? "border-l border-[var(--border-strong)]" : "",
              value === opt.value
                ? "bg-[var(--accent)] font-semibold text-zinc-950"
                : "text-[var(--fg-mute)] hover:text-[var(--fg)]",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
interface TweakToggleProps {
  label:    string;
  checked:  boolean;
  onChange: (v: boolean) => void;
}

function TweakToggle({ label, checked, onChange }: TweakToggleProps) {
  return (
    <TweakRow label={label}>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-5 w-9 flex-shrink-0 rounded-full",
          "transition-colors duration-200",
          checked ? "bg-[var(--accent)]" : "bg-[var(--border-strong)]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm",
            "transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0.5",
          ].join(" ")}
        />
      </button>
    </TweakRow>
  );
}

// ── Range slider ──────────────────────────────────────────────────────────────
interface TweakSliderProps {
  label:    string;
  min:      number;
  max:      number;
  step:     number;
  value:    number;
  onChange: (v: number) => void;
}

function TweakSlider({ label, min, max, step, value, onChange }: TweakSliderProps) {
  return (
    <TweakRow label={label}>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1 w-24 cursor-pointer accent-[var(--accent)]"
        />
        <span className="w-7 text-right font-mono text-[10px] tabular-nums text-[var(--fg-mute)]">
          {value}
        </span>
      </div>
    </TweakRow>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function PortfolioTweaks() {
  const [t, setT] = useTweaks(TWEAK_DEFAULTS);

  // Sync every tweak → body data-* attributes.
  // globals.css responds to data-theme, data-accent, and data-heading-font
  // via scoped CSS variable overrides.
  useEffect(() => {
    document.body.dataset.theme       = t.theme;
    document.body.dataset.accent      = t.accent;
    document.body.dataset.cursor      = String(t.cursor);
    document.body.dataset.headingFont = t.headingFont;
    document.body.dataset.grain       = String(t.showGrain);
  }, [t]);

  return (
    <>
      {/* Film grain — fixed overlay with SVG feTurbulence noise */}
      {t.showGrain && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9997] opacity-[0.055]"
          style={{ backgroundImage: GRAIN_BG, backgroundSize: "200px" }}
        />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakRadio
            label="Mode"
            value={t.theme}
            options={[
              { value: "dark",  label: "Dark"  },
              { value: "light", label: "Light" },
            ]}
            onChange={(v) => setT("theme", v as Tweaks["theme"])}
          />
        </TweakSection>

        <TweakSection title="Accent">
          {/* Color swatches — ring indicates active */}
          <div className="flex gap-2">
            {ACCENT_SWATCHES.map((s) => (
              <button
                key={s.id}
                title={s.id}
                onClick={() => setT("accent", s.id)}
                className={[
                  "h-6 w-6 rounded-full transition-all duration-150",
                  "ring-offset-1 ring-offset-[var(--bg-elev)]",
                  t.accent === s.id
                    ? "scale-110 ring-2 ring-[var(--fg)]"
                    : "opacity-60 hover:scale-110 hover:opacity-100",
                ].join(" ")}
                style={{ background: s.color }}
              />
            ))}
          </div>
        </TweakSection>

        <TweakSection title="Heading font">
          <TweakRadio
            label="Family"
            value={t.headingFont}
            options={[
              { value: "geist", label: "Mono"  },
              { value: "serif", label: "Serif" },
              { value: "inter", label: "Sans"  },
            ]}
            onChange={(v) => setT("headingFont", v as Tweaks["headingFont"])}
          />
        </TweakSection>

        <TweakSection title="Effects">
          <TweakToggle
            label="Custom cursor"
            checked={t.cursor}
            onChange={(v) => setT("cursor", v)}
          />
          <TweakToggle
            label="Film grain"
            checked={t.showGrain}
            onChange={(v) => setT("showGrain", v)}
          />
          <TweakSlider
            label="Particle density"
            min={20}
            max={140}
            step={10}
            value={t.particleDensity}
            onChange={(v) => setT("particleDensity", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
