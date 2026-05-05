"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h2 className="font-[var(--font-heading)] text-2xl font-medium">
        Something went wrong
      </h2>
      <p className="text-[var(--fg-dim)]">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
