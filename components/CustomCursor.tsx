"use client";

import { useEffect, useRef } from "react";

// Selectors that trigger hover-state morphing on the ring
const HOVER_SEL = "a, button, [data-cursor-hover], input, textarea";
// Subset that morphs the ring into a text-beam shape
const TEXT_SEL  = "input[type=text], input[type=email], textarea";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Elements are guaranteed non-null here (refs attached to DOM)
    const dot:  HTMLDivElement = dotRef.current!;
    const ring: HTMLDivElement = ringRef.current!;

    // Start both elements centered so the ring lerp origin feels natural
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let rafId  = 0;

    // ── Dot — snaps instantly ─────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
    };
    window.addEventListener("mousemove", onMove);

    // ── Ring — lerps at 18 % per frame (≈ 60 fps easing) ─────
    function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(loop);
    }
    loop();

    // ── Hover & text states via event delegation ──────────────
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest) return;
      if (t.closest(TEXT_SEL)) {
        // Text input → thin vertical beam
        ring.classList.remove("is-hover");
        ring.classList.add("is-text");
      } else if (t.closest(HOVER_SEL)) {
        ring.classList.add("is-hover");
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest) return;
      if (t.closest(TEXT_SEL))   ring.classList.remove("is-text");
      if (t.closest(HOVER_SEL))  ring.classList.remove("is-hover");
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    // Pause RAF when tab is hidden to save CPU
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        loop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Both elements are transparent and hidden on touch/hover:none devices via CSS.
  // The actual visual styles (size, border, color) live in globals.css so they
  // respond to CSS variable changes (accent swaps, theme switches) without JS.
  return (
    <>
      <div
        id="cursorDot"
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[99999] will-change-transform"
      />
      <div
        id="cursorRing"
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[99998] will-change-transform"
      />
    </>
  );
}
