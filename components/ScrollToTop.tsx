"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const btn = btnRef.current;
    if (!btn) return;
    btn.classList.add("scroll-top-btn--click");
    btn.addEventListener(
      "animationend",
      () => btn.classList.remove("scroll-top-btn--click"),
      { once: true }
    );
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`scroll-top-btn${visible ? " scroll-top-btn--visible" : ""}`}
    >
      <svg
        className="scroll-top-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
