"use client";

import { useEffect, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface HeroCanvasProps {
  density: number;
}

interface HeroProps {
  density: number;
}

// ── Canvas particle field ─────────────────────────────────────────────────────
// Keeps all canvas imperative logic isolated from the Hero markup.
function HeroCanvas({ density }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    // Explicit type annotation so TypeScript trusts canvas as non-null inside closures
    const canvas: HTMLCanvasElement = canvasEl;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };

    // ── Setup / resize ────────────────────────────────────────
    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      const count = Math.floor((w * h) / (12000 - density * 80));
      particles = Array.from({ length: Math.max(40, count) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4,
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Mouse tracking ────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    // ── Theme helpers (read each frame so theme changes reflect live) ──
    function getAccent(): string {
      return (
        getComputedStyle(document.body).getPropertyValue("--accent").trim() ||
        "oklch(0.82 0.16 80)"
      );
    }
    function getFgRgb(): string {
      return document.body.dataset.theme === "light"
        ? "24, 24, 28"
        : "245, 245, 244";
    }

    // ── Render loop ───────────────────────────────────────────
    function tick() {
      ctx.clearRect(0, 0, w, h);
      const accent = getAccent();
      const fg = getFgRgb();

      // Update + draw particles
      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < 22500) {
          const dist = Math.sqrt(dist2 || 1);
          const f = (1 - dist / 150) * 0.06;
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap at edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fg}, 0.55)`;
        ctx.fill();
      }

      // Connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${fg}, ${(1 - d / 110) * 0.18})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Cursor accent glow
      if (mouse.x > -9000) {
        const grad = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 180
        );
        // oklch(L C H) → oklch(L C H / α)
        grad.addColorStop(0, accent.replace(")", " / 0.18)"));
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - 180, mouse.y - 180, 360, 360);
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    tick();

    // Pause RAF when the tab is hidden to save CPU
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]); // re-init when density changes

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero({ density }: HeroProps) {
  const [time, setTime] = useState("");

  // Live Casablanca clock (updates every minute)
  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Africa/Casablanca",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) + " GMT+1"
      );
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-[120px] pb-20"
    >
      {/* ── Particle canvas ───────────────────────────────────── */}
      <HeroCanvas density={density} />

      {/* ── Radial vignette (fades canvas edges into page bg) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 30%, var(--bg) 90%)",
        }}
      />

      {/* ── Content ──────────────────────────────────────────── */}
      {/* data-stagger staggers the 3 children: meta → h1 → CTA row */}
      <div data-stagger="200" className="relative z-2 mx-auto w-full max-w-6xl px-6 md:px-10">

        {/* Meta row — availability status + local time */}
        <div
          className={[
            "mb-[60px] flex items-center justify-between",
            "font-(--font-heading) text-[12px] uppercase",
            "tracking-wider text-(--fg-mute)",
          ].join(" ")}
        >
          <span className="flex items-center gap-2">
            {/* Pulse dot */}
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"
            />
            Available for opportunities
          </span>
          <span className="hidden sm:block">{time} — Casablanca</span>
        </div>

        {/* Main title */}
        <h1
          className={[
            "mb-10",
            "font-(--font-heading)",
            "text-[clamp(48px,9vw,140px)]",
            "font-medium leading-[0.92] tracking-[-0.04em]",
          ].join(" ")}
        >
          <span className="block">Building</span>

          <span className="block">
            <em
              className="font-normal italic text-(--accent)"
              style={{ fontStyle: "italic" }} // ensures no Preflight conflict
            >
              thoughtful
            </em>{" "}
            software
          </span>

          <span className="block text-(--fg-dim)">
            for the modern web
            <span className="text-(--accent)">.</span>
          </span>
        </h1>

        {/* Bottom row — bio + CTAs */}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          <p className="max-w-[460px] text-[17px] leading-relaxed text-(--fg-dim)">
            I&apos;m{" "}
            <span className="text-(--fg)">Mohamed Idbenouakrim</span> — a
            software engineer focused primarily on backend development, turning fuzzy ideas into fast, reliable systems. Currently designing and shipping scalable APIs and services with Node.js, Python, and FastAPI, while still building seamless full-stack experiences with React when needed. Passionate about performance, clean architecture, and attention to detail.
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Primary CTA */}
            <a
              href="#projects"
              data-cursor-hover
              className={[
                "flex items-center gap-2 rounded-full px-6 py-3",
                "bg-(--accent) text-zinc-950",
                "text-sm font-medium transition-opacity hover:opacity-90",
              ].join(" ")}
            >
              Selected work
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            {/* Ghost CTA */}
            <a
              href="#contact"
              data-cursor-hover
              className={[
                "flex items-center gap-2 rounded-full px-6 py-3",
                "border border-(--border) text-(--fg)",
                "text-sm font-medium transition-colors hover:bg-white/5",
              ].join(" ")}
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* ── Scroll cue ───────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className={[
          "absolute bottom-8 left-1/2 z-2",
          "-translate-x-1/2",
          "flex flex-col items-center gap-3",
          "font-(--font-heading) text-[11px] uppercase",
          "tracking-[0.15em] text-(--fg-mute)",
        ].join(" ")}
      >
        <span>Scroll</span>
        <span
          className="block h-9 w-px animate-scroll-pulse"
          style={{
            background: "linear-gradient(to bottom, var(--fg-mute), transparent)",
          }}
        />
      </div>
    </section>
  );
}
