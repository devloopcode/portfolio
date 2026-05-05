"use client";

import { useState } from "react";
import type { ReactNode, ChangeEvent, FormEvent } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormState {
  name:    string;
  email:   string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;
type Status = "idle" | "sending" | "sent";

// ── Data ──────────────────────────────────────────────────────────────────────
const CONTACT_LINKS = [
  {
    label: "Email",
    val:   "medidbenouakrim@gmail.com",
    href:  "mailto:medidbenouakrim@gmail.com",
  },
  {
    label: "GitHub",
    val:   "github.com/devloopcode",
    href:  "https://github.com/devloopcode",
  },
  {
    label: "LinkedIn",
    val:   "in/mohamed-idbenouakrim",
    href:  "https://www.linkedin.com/in/mohamed-idbenouakrim-37528219a/",
  },
] as const;

// ── Shared input / textarea class string ──────────────────────────────────────
// Defined once so both <input> and <textarea> stay visually identical.
const INPUT_CLS = [
  "w-full rounded-[4px]",
  "border border-[var(--border-strong)]",
  "bg-[var(--bg)] px-4 py-[14px]",
  "font-sans text-[15px] text-[var(--fg)]",
  "placeholder:text-[var(--fg-mute)]",
  "transition-colors duration-200",
  "focus:border-[var(--accent)] focus:bg-[var(--bg-elev-2)] focus:outline-none",
].join(" ");

// ── Field wrapper ─────────────────────────────────────────────────────────────
interface FieldProps {
  label:    string;
  error?:   string;
  children: ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--fg-dim)]">
        <span>{label}</span>
        {error && <span className="text-[var(--accent)]">{error}</span>}
      </span>
      {children}
    </label>
  );
}

// ── Arrow icon ────────────────────────────────────────────────────────────────
function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      width="16"
      height="16"
      aria-hidden="true"
      className="shrink-0 text-[var(--fg-mute)] transition-all duration-[250ms] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--accent)]"
    >
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

// ── Contact section ───────────────────────────────────────────────────────────
export default function Contact() {
  const [form,   setForm  ] = useState<FormState>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim())    e.name = "Required";
    if (!form.email.trim())   e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Required";
    else if (form.message.trim().length < 10) e.message = "A bit more, please";
    return e;
  };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }, 1100);
  };

  // ── Per-field updater ──────────────────────────────────────────────────────
  const update =
    (key: keyof FormState) =>
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: ev.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section id="contact" className="pb-16 pt-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">

        {/* Section label */}
        <div className="reveal mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-mute)]">
          <span>05 — Contact</span>
        </div>

        {/* Two-column layout */}
        {/* data-stagger: left column (copy + links) then the form */}
        <div data-stagger="130" className="grid grid-cols-1 items-start gap-12 min-[900px]:grid-cols-2 min-[900px]:gap-20">

          {/* ── Left column: copy + links ──────────────────────── */}
          <div>
            <h2 className="mb-6 font-[var(--font-heading)] text-3xl font-medium leading-tight tracking-tight md:text-[2.6rem]">
              Got a{" "}
              <em
                className="font-[var(--font-serif)] font-normal italic text-[var(--accent)]"
                style={{ fontStyle: "italic" }}
              >
                thing
              </em>{" "}
              to build?
            </h2>

            <p className="mb-10 max-w-[460px] text-[18px] leading-[1.6] text-[var(--fg-dim)]">
              I&apos;m currently taking on new work for Q3 onwards — full-time
              roles, contracts, and the occasional weekend collab. The fastest
              way to reach me is email, but I lurk on the usual places too.
            </p>

            {/* Contact links — hover slides row right, arrow moves diagonally */}
            <div>
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  className={[
                    "group grid grid-cols-[100px_1fr_auto] items-center gap-4",
                    "border-t border-[var(--border)] py-[18px]",
                    "transition-all duration-[250ms] hover:pl-3",
                  ].join(" ")}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--fg-mute)]">
                    {link.label}
                  </span>
                  <span className="font-[var(--font-heading)] text-[16px]">
                    {link.val}
                  </span>
                  <ArrowIcon />
                </a>
              ))}
              {/* Closing border */}
              <div className="border-t border-[var(--border)]" />
            </div>
          </div>

          {/* ── Right column: contact form ─────────────────────── */}
          <form
            onSubmit={submit}
            className="grid gap-5 rounded-[6px] border border-[var(--border)] bg-[var(--bg-elev)] p-8"
          >
            {/* Form header */}
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--fg-mute)]">
              <span>New Message</span>
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]"
                />
                Online
              </span>
            </div>

            <Field label="Name" error={errors.name}>
              <input
                value={form.name}
                onChange={update("name")}
                type="text"
                placeholder="Your name"
                className={INPUT_CLS}
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                value={form.email}
                onChange={update("email")}
                type="email"
                placeholder="you@somewhere.com"
                className={INPUT_CLS}
              />
            </Field>

            <Field label="Message" error={errors.message}>
              <textarea
                value={form.message}
                onChange={update("message")}
                rows={5}
                placeholder="What are you building?"
                className={`${INPUT_CLS} resize-y`}
              />
            </Field>

            {/* Submit — three visual states */}
            <button
              type="submit"
              disabled={status === "sending"}
              className={[
                "mt-1 flex w-full items-center justify-center gap-2",
                "rounded-full bg-[var(--accent)] px-6 py-3",
                "text-sm font-medium text-zinc-950",
                "transition-opacity hover:opacity-90",
                "disabled:cursor-progress disabled:opacity-70",
              ].join(" ")}
            >
              {status === "idle" && (
                <>
                  Send message
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
                </>
              )}
              {status === "sending" && (
                <>
                  Sending
                  {/* dotPulse keyframe is defined in globals.css */}
                  <span className="inline-block animate-[dotPulse_1.2s_infinite]">
                    ...
                  </span>
                </>
              )}
              {status === "sent" && <>Sent ✓ — I&apos;ll be in touch</>}
            </button>

            {/* Disclaimer */}
            <p className="text-center font-mono text-[10px] tracking-[0.04em] text-[var(--fg-mute)]">
              <span className="text-[var(--accent)]">※</span> demo form · for
              now, please use email directly
            </p>
          </form>
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="mt-[100px] flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-8 font-mono text-[11px] tracking-[0.05em] text-[var(--fg-mute)]">
          <span>© 2026 — Mohamed Idbenouakrim</span>
          <span>Built with care · Casablanca → world</span>
          <a
            href="#home"
            data-cursor-hover
            className="transition-colors duration-200 hover:text-[var(--fg)]"
          >
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
