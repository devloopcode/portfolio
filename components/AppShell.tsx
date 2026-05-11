"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import { TWEAK_DEFAULTS } from "@/components/PortfolioTweaks";
import CustomCursor from "@/components/CustomCursor";
import ScrollToTop from "@/components/ScrollToTop";
import LoadingScreen from "@/components/LoadingScreen";

export default function AppShell() {
  // Seeded from TWEAK_DEFAULTS; updated live via postMessage from PortfolioTweaks
  const [density, setDensity] = useState(TWEAK_DEFAULTS.particleDensity);

  // Re-render Hero when the Tweaks slider moves
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (
        e.data?.type === "__tweaks_internal_changed" &&
        "particleDensity" in (e.data.edits ?? {})
      ) {
        setDensity(e.data.edits.particleDensity as number);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Scroll-reveal: individual .reveal elements + [data-stagger] groups
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      document.querySelectorAll<HTMLElement>("[data-stagger] > *").forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    // ── Individual elements (.reveal) ────────────────────────────
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

    // ── Stagger groups ([data-stagger]) ──────────────────────────
    // When the container enters the viewport, each direct child
    // gets is-visible with an incrementing transitionDelay.
    // The attribute value sets the per-item step in ms.
    const staggerObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const container = entry.target as HTMLElement;
          const step = Number(container.dataset.stagger) || 75;
          Array.from(container.children).forEach((child, i) => {
            const el = child as HTMLElement;
            el.style.transitionDelay = `${i * step}ms`;
            el.classList.add("is-visible");
          });
          staggerObs.unobserve(container);
        });
      },
      // Lower threshold so the animation starts as soon as the container peeks in
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((el) =>
      staggerObs.observe(el)
    );

    return () => {
      revealObs.disconnect();
      staggerObs.disconnect();
    };
  }, []);

  // (Custom cursor is now self-contained in <CustomCursor />)

  return (
    <>
      <LoadingScreen />
      <Nav />
      <main id="main-content">
        <Hero density={density} />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <CustomCursor />
      <ScrollToTop />
    </>
  );
}
