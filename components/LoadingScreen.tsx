"use client";

import { useEffect, useState } from "react";

const TITLE = "Software Engineer";
const FULL_NAME = "Mohamed Idbenouakrim";
const STAGGER = 0.07;  // seconds between each letter
const TITLE_START = 0.15;  // delay before first title letter
const NAME_START = 0.7;   // delay before first name letter

function LetterByLetter({
  text,
  startDelay,
  duration,
  className,
}: {
  text: string;
  startDelay: number;
  duration: number;
  className?: string;
}) {
  return (
    <p className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: "inline-block",
            opacity: 0,
            animation: `loadCharIn ${duration}s cubic-bezier(0.16,1,0.3,1) ${startDelay + i * STAGGER}s forwards`,
            ...(char === " " ? { width: "0.35em" } : {}),
          }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </p>
  );
}

export default function LoadingScreen() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.dataset.loading = "true";
    const t1 = setTimeout(() => setExiting(true), 2400);
    const t2 = setTimeout(() => {
      delete document.body.dataset.loading;
      setDone(true);
    }, 3150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      delete document.body.dataset.loading;
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-(--bg)"
      style={{
        transform: exiting ? "translateY(-100%)" : "translateY(0)",
        transition: exiting ? "transform 750ms cubic-bezier(0.87,0,0.13,1)" : "none",
        pointerEvents: exiting ? "none" : undefined,
      }}
    >
      {/* Role / title — letter by letter */}
      <LetterByLetter
        text={TITLE}
        startDelay={TITLE_START}
        duration={0.65}
        className="font-(--font-heading) text-[11px] uppercase tracking-[0.35em] text-(--fg-mute)"
      />

      {/* Full name — letter by letter */}
      <LetterByLetter
        text={FULL_NAME}
        startDelay={NAME_START}
        duration={0.7}
        className="mt-3 font-(--font-heading) text-[clamp(30px,6vw,72px)] tracking-[-0.04em] leading-none text-(--fg)"
      />

      {/* Progress bar */}
      <div
        className="mt-10 h-px w-44 overflow-hidden"
        style={{ background: "var(--border-strong)" }}
      >
        <div
          className="h-full bg-(--accent)"
          style={{
            width: "0%",
            animation: "loadLine 1.5s cubic-bezier(0.4,0,0.2,1) 0.4s forwards",
          }}
        />
      </div>
    </div>
  );
}
