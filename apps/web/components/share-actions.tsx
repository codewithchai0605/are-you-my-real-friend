"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { shareMessage } from "@/lib/copy";
import { softButton } from "./ui";

const noopSubscribe = () => () => {};

/** Old-browser / non-https fallback when navigator.clipboard isn't available. */
function legacyCopy(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(area);
  }
}

export function ShareActions({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  // false on the server + first client render, so there's no hydration mismatch.
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );

  async function copy() {
    let ok: boolean;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      ok = legacyCopy(url);
    }
    if (!ok) return;
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: "Think you know me?", text: shareMessage(""), url });
    } catch {
      /* the user closed the share sheet – nothing to do */
    }
  }

  const text = encodeURIComponent(shareMessage(url));
  const chip = "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-display text-lg font-semibold text-white transition duration-150 hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ff5fa2] active:translate-y-0.5";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-2xl border-[3px] border-blue-1000 bg-[#fffdf8] p-1.5 pl-4 shadow-[0_6px_16px_rgba(42,138,246,0.15)]">
        <label htmlFor="quiz-link" className="sr-only">
          Your quiz link
        </label>
        <input
          id="quiz-link"
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 bg-transparent font-display text-base font-medium text-[#17213e] outline-none"
        />
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-xl bg-blue-1000 px-4 py-2.5 font-display text-lg font-bold text-white shadow-[0_3px_0_#1b64b8] transition active:translate-y-0.5 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#ff5fa2]"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </p>

      <div className="flex gap-3">
        <a
          href={`https://wa.me/?text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${chip} bg-[#25d366] shadow-[0_4px_0_#179a49]`}
        >
          WhatsApp
        </a>
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Think you know me well? Take my quiz and tell!")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${chip} bg-[#2aabee] shadow-[0_4px_0_#1d7fb0]`}
        >
          Telegram
        </a>
      </div>

      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={softButton}>
          More ways to share…
        </button>
      )}
    </div>
  );
}
