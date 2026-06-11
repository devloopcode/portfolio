"use client";

import { useEffect, useState } from "react";

const FIRST_NAME = "Mohamed";
const LAST_NAME  = "Idbenouakrim";
const ROLE       = "Software Engineer";

const STAGGER = 0.065;

function BlurReveal({
  text,
  startDelay,
  className,
}: {
  text: string;
  startDelay: number;
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
            animation: `loadCharBlurIn 0.85s cubic-bezier(0.16,1,0.3,1) ${(startDelay + i * STAGGER).toFixed(3)}s forwards`,
          }}
        >
          {char}
        </span>
      ))}
    </p>
  );
}

export default function LoadingScreen() {
  const [exiting, setExiting] = useState(false);
  const [done,    setDone   ] = useState(false);

  useEffect(() => {
    document.body.dataset.loading = "true";
    const t1 = setTimeout(() => setExiting(true), 2700);
    const t2 = setTimeout(() => {
      delete document.body.dataset.loading;
      setDone(true);
    }, 3450);
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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        background: "#06050e",
        transform:  exiting ? "translateY(-100%)" : "translateY(0)",
        transition: exiting ? "transform 750ms cubic-bezier(0.87,0,0.13,1)" : "none",
        pointerEvents: exiting ? "none" : undefined,
      }}
    >
      {/* Drifting ambient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "0%", left: "-5%",
          width: "70vw", height: "70vw",
          background: "radial-gradient(circle, rgba(100,45,255,0.28) 0%, transparent 65%)",
          filter: "blur(90px)",
          animation: "ambientDrift1 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "0%", right: "-5%",
          width: "60vw", height: "60vw",
          background: "radial-gradient(circle, rgba(0,175,225,0.20) 0%, transparent 65%)",
          filter: "blur(110px)",
          animation: "ambientDrift2 11s ease-in-out infinite",
        }}
      />

      {/* Soft glow that "belongs" to the name */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "75vw", height: "38vw",
          background: "radial-gradient(ellipse, rgba(70,45,200,0.16) 0%, transparent 65%)",
          filter: "blur(70px)",
          opacity: 0,
          animation: "loadFadeIn 1.4s ease 0.6s forwards",
        }}
      />

      {/* Role label */}
      <div
        className="mb-10 flex items-center gap-3"
        style={{
          opacity: 0,
          animation: "loadFadeIn 0.7s ease 0.1s forwards",
        }}
      >
        <span className="block h-px w-10" style={{ background: "rgba(255,255,255,0.16)" }} />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.44em]"
          style={{ color: "rgba(255,255,255,0.36)" }}
        >
          {ROLE}
        </span>
        <span className="block h-px w-10" style={{ background: "rgba(255,255,255,0.16)" }} />
      </div>

      {/* Name — two lines, light weight, large */}
      <div className="flex flex-col items-center">
        <BlurReveal
          text={FIRST_NAME}
          startDelay={0.35}
          className="font-(--font-heading) font-light leading-[0.9] tracking-[-0.03em] text-[clamp(52px,10vw,128px)] text-[rgba(255,255,255,0.93)]"
        />
        <BlurReveal
          text={LAST_NAME}
          startDelay={0.62}
          className="font-(--font-heading) font-light leading-[0.9] tracking-[-0.03em] text-[clamp(52px,10vw,128px)] text-[rgba(255,255,255,0.42)]"
        />
      </div>

      {/* Gradient accent line */}
      <div
        className="mt-12 h-px overflow-hidden"
        style={{
          width: "clamp(140px,22vw,300px)",
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="h-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(110,55,255,0.9) 30%, rgba(0,185,230,0.9) 70%, transparent)",
            width: "0%",
            animation: "loadLine 1.1s cubic-bezier(0.4,0,0.2,1) 1.35s forwards",
          }}
        />
      </div>
    </div>
  );
}
