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

// ── Constants ────────────────────────────────────────────────────────────────
const NAV_LINKS: NavLink[] = [
  { num: "01", label: "About",    href: "#about",      sectionId: "about"      },
  { num: "02", label: "Work",     href: "#projects",   sectionId: "projects"   },
  { num: "03", label: "Stack",    href: "#skills",     sectionId: "skills"     },
  { num: "04", label: "CV",       href: "#experience", sectionId: "experience" },
];

// ── Icons ────────────────────────────────────────────────────────────────────
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

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 12h18M3 6h18M3 18h12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────────────
export default function Nav() {
  const [scrolled,       setScrolled]       = useState(false);
  const [theme,          setTheme]          = useState<Theme>("dark");
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [activeSection,  setActiveSection]  = useState("home");

  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef    = useRef<HTMLDivElement>(null);

  // Read initial theme from body (client-only)
  useEffect(() => {
    setTheme((document.body.dataset.theme as Theme) || "dark");
  }, []);

  // Scroll → sticky bar style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Watch external theme changes (e.g. Tweaks panel) via MutationObserver
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme((document.body.dataset.theme as Theme) || "dark");
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // Active section tracking via IntersectionObserver
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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Inert + focus management — keep drawer non-interactive when collapsed
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    if (menuOpen) {
      drawer.removeAttribute("inert");
      drawer.querySelector<HTMLElement>("a, button")?.focus();
    } else {
      drawer.setAttribute("inert", "");
    }
  }, [menuOpen]);

  // Keyboard focus trap: Tab cycles within drawer, Escape closes it
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
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

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    setTheme(next);
    window.parent.postMessage(
      { type: "__edit_mode_set_keys", edits: { theme: next } },
      "*"
    );
  };

  // ── Derived style helpers ─────────────────────────────────────────────────
  const isDark = theme === "dark";

  const navBg = scrolled
    ? isDark
      ? "bg-zinc-950/80 backdrop-blur-md shadow-[0_1px_0_0_rgba(255,255,255,0.06)] shadow-black/30"
      : "bg-white/80 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)] shadow-black/10"
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

  const drawerBg = isDark
    ? "bg-zinc-950/95 backdrop-blur-md border-t border-white/6"
    : "bg-white/95 backdrop-blur-md border-t border-black/6";

  function linkCls(sectionId: string) {
    const isActive = activeSection === sectionId;
    const activeColor = isDark ? "text-zinc-100" : "text-zinc-900";
    const idleColor   = isDark ? "text-zinc-500" : "text-zinc-500";
    return [
      "group relative flex items-center gap-1.5 text-sm font-medium",
      "transition-colors duration-200",
      isActive ? activeColor : idleColor,
      isDark ? "hover:text-zinc-100" : "hover:text-zinc-900",
    ].join(" ");
  }

  function mobileLinkCls(sectionId: string) {
    const isActive = activeSection === sectionId;
    const base = "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150";
    if (isDark) return `${base} ${isActive ? "bg-white/8 text-zinc-100" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"}`;
    return      `${base} ${isActive ? "bg-black/6 text-zinc-900"  : "text-zinc-500 hover:bg-black/4 hover:text-zinc-900"}`;
  }

  const numCls = isDark ? "font-mono text-[10px] text-zinc-600" : "font-mono text-[10px] text-zinc-400";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        navBg,
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">

        {/* Logo */}
        <a
          href="#home"
          data-cursor-hover
          className={[
            "flex items-center gap-2.5 font-semibold text-sm",
            "transition-opacity duration-200 hover:opacity-80",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
              logoMarkCls,
            ].join(" ")}
          >
            M
          </span>
          <span className={`hidden sm:block ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
            Mohamed Idbenouakrim
          </span>
        </a>

        {/* ── Desktop nav ─────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-7">

          {NAV_LINKS.map(({ num, label, href, sectionId }) => (
            <a
              key={href}
              href={href}
              data-cursor-hover
              className={linkCls(sectionId)}
            >
              <span className={numCls}>{num}</span>
              <span>{label}</span>
              {/* animated underline */}
              <span
                className={[
                  "absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-200 group-hover:w-full",
                  isDark ? "bg-zinc-100" : "bg-zinc-900",
                ].join(" ")}
              />
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
              "rounded-full border px-4 py-1.5 text-sm font-medium",
              "transition-all duration-200",
              ctaCls,
            ].join(" ")}
          >
            Let&apos;s talk
          </a>
        </div>

        {/* ── Mobile controls ──────────────────────────────────── */}
        <div className="flex md:hidden items-center gap-1">
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
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────────── */}
      <div
        ref={drawerRef}
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={[
          "overflow-hidden transition-all duration-300 md:hidden",
          drawerBg,
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
          {NAV_LINKS.map(({ num, label, href, sectionId }) => (
            <a
              key={href}
              href={href}
              data-cursor-hover
              className={mobileLinkCls(sectionId)}
              onClick={() => setMenuOpen(false)}
            >
              <span className={numCls}>{num}</span>
              <span>{label}</span>
            </a>
          ))}

          <a
            href="#contact"
            data-cursor-hover
            onClick={() => setMenuOpen(false)}
            className={[
              "mt-2 flex items-center justify-center rounded-xl border py-2.5",
              "text-sm font-medium transition-all duration-200",
              ctaCls,
            ].join(" ")}
          >
            Let&apos;s talk
          </a>
        </div>
      </div>
    </nav>
  );
}
