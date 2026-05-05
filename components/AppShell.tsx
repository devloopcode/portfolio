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

  // Scroll-reveal: flip .reveal → .is-visible as elements enter the viewport
  useEffect(() => {
    const els = document.querySelectorAll<Element>(".reveal");

    // Skip animation for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // (Custom cursor is now self-contained in <CustomCursor />)

  return (
    <>
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
    </>
  );
}
