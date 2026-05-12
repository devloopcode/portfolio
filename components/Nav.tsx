"use client";

import { useState, useEffect, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
type Theme = "dark" | "light";

interface NavLink {
  num: string;
  label: string;
  href: string;
  sectionId: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS: NavLink[] = [
  { num: "01", label: "About",      href: "#about",      sectionId: "about"      },
  { num: "02", label: "Work",       href: "#projects",   sectionId: "projects"   },
  { num: "03", label: "Stack",      href: "#skills",     sectionId: "skills"     },
  { num: "04", label: "Experience", href: "#experience", sectionId: "experience" },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/**
 * Animated hamburger ↔ close icon.
 * The two icons cross-fade + rotate so the transition feels intentional
 * rather than a plain swap.
 */
function MenuToggle({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative h-5 w-5" aria-hidden="true">
      {/* Hamburger — rotates out and fades when open */}
      <span className={[
        "absolute inset-0 flex items-center justify-center",
        "transition-all duration-200",
        isOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
      ].join(" ")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12h18M3 6h18M3 18h12" />
        </svg>
      </span>

      {/* Close — rotates in when open */}
      <span className={[
        "absolute inset-0 flex items-center justify-center",
        "transition-all duration-200",
        isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
      ].join(" ")}>
        <CloseIcon />
      </span>
    </div>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────────────
export default function Nav() {
  const [scrolled,      setScrolled]      = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme,         setTheme]         = useState<Theme>("dark");
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef    = useRef<HTMLElement>(null);

  const closeMenu = () => setMenuOpen(false);

  // Read initial theme from body (runs client-side only)
  useEffect(() => {
    setTheme((document.body.dataset.theme as Theme) || "dark");
  }, []);

  // Sticky nav background + scroll progress
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mirror external theme changes (e.g. Tweaks panel writes to body dataset)
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme((document.body.dataset.theme as Theme) || "dark");
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // Highlight the nav link for whichever section occupies most of the viewport
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.45 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Auto-close drawer when the viewport grows to desktop width
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) closeMenu(); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Toggle `inert` so drawer contents are unreachable by Tab when hidden
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    if (menuOpen) {
      drawer.removeAttribute("inert");
      // Move focus to first interactive element
      drawer.querySelector<HTMLElement>("a, button")?.focus();
    } else {
      drawer.setAttribute("inert", "");
    }
  }, [menuOpen]);

  // Focus trap: Tab cycles within drawer; Escape closes it
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        toggleBtnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusables = Array.from(
        drawer.querySelectorAll<HTMLElement>("a:not([disabled]), button:not([disabled])")
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // ── Theme toggle ──────────────────────────────────────────────────────────
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    setTheme(next);
    // Notify the Tweaks panel so its state stays in sync
    window.parent.postMessage(
      { type: "__edit_mode_set_keys", edits: { theme: next } },
      "*"
    );
  };

  // ── Derived style classes ─────────────────────────────────────────────────
  const isDark = theme === "dark";

  const navBg = scrolled
    ? isDark
      ? "bg-zinc-950/80 backdrop-blur-md shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
      : "bg-white/80    backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
    : "bg-transparent";

  const logoMarkCls = isDark
    ? "bg-white text-zinc-950"
    : "bg-zinc-950 text-white";

  const iconBtnCls = isDark
    ? "text-zinc-500 hover:text-zinc-100 hover:bg-white/8"
    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/8";

  const ctaCls = isDark
    ? "border-white/15 text-zinc-100 hover:bg-white hover:text-zinc-950"
    : "border-zinc-900/15 text-zinc-900 hover:bg-zinc-950 hover:text-white";

  // Desktop link — underline animation, active colour
  function linkCls(sectionId: string) {
    const isActive    = activeSection === sectionId;
    const activeColor = isDark ? "text-zinc-100"  : "text-zinc-900";
    const idleColor   = isDark ? "text-zinc-500"  : "text-zinc-500";
    return [
      "group relative flex items-center gap-1.5 text-sm font-medium",
      "transition-colors duration-200",
      isActive ? activeColor : idleColor,
      isDark ? "hover:text-zinc-100" : "hover:text-zinc-900",
    ].join(" ");
  }

  // Mobile drawer link — filled pill when active
  function mobileLinkCls(sectionId: string) {
    const isActive = activeSection === sectionId;
    const base = "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150";
    if (isDark) return `${base} ${isActive ? "bg-white/8 text-zinc-100" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"}`;
    return           `${base} ${isActive ? "bg-black/6 text-zinc-900"  : "text-zinc-500 hover:bg-black/4 hover:text-zinc-900"}`;
  }

  const numCls = isDark
    ? "font-mono text-[10px] text-zinc-600"
    : "font-mono text-[10px] text-zinc-400";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────────
          Covers the page behind the drawer. Clicking it closes the drawer.
          pointer-events-none when hidden so it never intercepts clicks.     */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={[
          "fixed inset-0 z-40 md:hidden",
          "bg-black/50 backdrop-blur-[2px]",
          "transition-opacity duration-300",
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* ── Top nav bar ──────────────────────────────────────────────────── */}
      <nav
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          navBg,
        ].join(" ")}
      >
        {/* Scroll progress bar */}
        <div className="absolute inset-x-0 top-0 h-[2px] overflow-hidden">
          <div
            className="h-full transition-[width] duration-100 ease-out"
            style={{ width: `${scrollProgress}%`, background: "var(--accent)", boxShadow: "0 0 12px 4px var(--accent), 0 0 24px 8px var(--accent)" }}
          />
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">

          {/* Logo */}
          <a
            href="#"
            data-cursor-hover
            className="flex items-center gap-2.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-80"
          >
            <span className={[
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
              logoMarkCls,
            ].join(" ")}>
              M
            </span>
            <span className={`hidden sm:block ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              Mohamed Idbenouakrim
            </span>
          </a>

          {/* ── Desktop links + controls (hidden on mobile) ───────────── */}
          <div className="hidden items-center gap-7 md:flex">

            {NAV_LINKS.map(({ num, label, href, sectionId }) => (
              <a key={href} href={href} data-cursor-hover className={linkCls(sectionId)}>
                <span className={numCls}>{num}</span>
                <span>{label}</span>
                {/* Underline that grows from left on hover */}
                <span className={[
                  "absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-200 group-hover:w-full",
                  isDark ? "bg-zinc-100" : "bg-zinc-900",
                ].join(" ")} />
              </a>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              data-cursor-hover
              className={[
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                iconBtnCls,
              ].join(" ")}
            >
              {isDark ? <MoonIcon /> : <SunIcon />}
            </button>

            {/* CTA */}
            <a
              href="#contact"
              data-cursor-hover
              className={[
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                ctaCls,
              ].join(" ")}
            >
              Let&apos;s talk
            </a>
          </div>

          {/* ── Mobile controls (hidden on desktop) ──────────────────── */}
          <div className="flex items-center gap-1 md:hidden">

            {/* Theme toggle stays visible in the top bar on mobile */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={[
                "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                iconBtnCls,
              ].join(" ")}
            >
              {isDark ? <MoonIcon /> : <SunIcon />}
            </button>

            {/* Hamburger / close — animated icon swap */}
            <button
              ref={toggleBtnRef}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={[
                "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                iconBtnCls,
              ].join(" ")}
            >
              <MenuToggle isOpen={menuOpen} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Right-side drawer (mobile only) ──────────────────────────────────
          Sits at z-[60] — above the backdrop (z-40) and the nav bar (z-50).
          Slides in from the right via translateX; the transition uses a
          spring-like ease for a more natural feel.                          */}
      <aside
        ref={drawerRef}
        id="mobile-menu"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
        className={[
          "fixed top-0 right-0 z-[60] h-full w-[300px] md:hidden",
          "flex flex-col",
          // Drawer surface
          isDark
            ? "bg-zinc-950 border-l border-white/8"
            : "bg-white    border-l border-black/6",
          // Slide animation — cubic-bezier mimics a spring for the open stroke
          "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          menuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* ── Drawer header ──────────────────────────────────────────── */}
        <div className={[
          "flex items-center justify-between px-5 py-4",
          isDark ? "border-b border-white/8" : "border-b border-black/6",
        ].join(" ")}>

          {/* Mini logo */}
          <a
            href="#"
            onClick={closeMenu}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className={[
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
              logoMarkCls,
            ].join(" ")}>
              M
            </span>
            <span className={`text-sm font-medium ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
              Mohamed
            </span>
          </a>

          {/* Explicit close button inside the drawer */}
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className={[
              "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
              iconBtnCls,
            ].join(" ")}
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Drawer nav links ───────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ num, label, href, sectionId }, i) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                data-cursor-hover
                className={[
                  mobileLinkCls(sectionId),
                  // Staggered entrance: each link fades + lifts in slightly after the drawer opens
                  "transition-all duration-300",
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                ].join(" ")}
                style={{
                  transitionDelay: menuOpen ? `${i * 55 + 100}ms` : "0ms",
                }}
              >
                <span className={numCls}>{num}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* ── Drawer footer — CTA ────────────────────────────────────── */}
        <div className={[
          "px-3 pb-8 pt-4",
          isDark ? "border-t border-white/8" : "border-t border-black/6",
        ].join(" ")}>
          <a
            href="#contact"
            onClick={closeMenu}
            data-cursor-hover
            className={[
              "flex w-full items-center justify-center rounded-xl border py-3",
              "text-sm font-medium transition-all duration-200",
              // Staggered entrance after the last nav link
              "transition-all duration-300",
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              ctaCls,
            ].join(" ")}
            style={{
              transitionDelay: menuOpen ? `${NAV_LINKS.length * 55 + 100}ms` : "0ms",
            }}
          >
            Let&apos;s talk
          </a>
        </div>
      </aside>
    </>
  );
}
