"use client";

import { useEffect, useRef } from "react";

type AdsterraAdProps = {
  placement: "rectangle" | "banner";
};

const PLACEMENTS = {
  rectangle: {
    key: "c32653c6d0ec1cff4e970457dc1bc710",
    width: 300,
    height: 250,
  },
  banner: {
    key: "4fec68dce02f3775fe96684cda6cf069",
    width: 320,
    height: 50,
  },
} as const;

// Adsterra reads the global `atOptions` as its script runs. Loading one unit at
// a time prevents two placements from overwriting each other's configuration. 
let adLoadQueue = Promise.resolve();

export function AdsterraAd({ placement }: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { key, width, height } = PLACEMENTS[placement];

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    if (!container) return;

    adLoadQueue = adLoadQueue.then(
      () =>
        new Promise<void>((resolve) => {
          if (cancelled) {
            resolve();
            return;
          }

          const optionsScript = document.createElement("script");
          optionsScript.text = `window.atOptions = ${JSON.stringify({
            key,
            format: "iframe",
            height,
            width,
            params: {},
          })};`;

          const adScript = document.createElement("script");
          adScript.src = `https://www.highrevenueformat.com/${key}/invoke.js`;
          adScript.async = true;
          adScript.onload = () => resolve();
          adScript.onerror = () => resolve();

          container.replaceChildren(optionsScript, adScript);
        }),
    );

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [height, key, width]);

  return (
    <aside
      aria-label="Advertisement"
      className="mx-auto my-7 flex w-fit max-w-full flex-col items-center"
    >
      <span className="mb-1 rounded-full bg-white/75 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#7890a8] shadow-sm">
        Advertisement
      </span>
      <div
        ref={containerRef}
        className="max-w-full overflow-hidden rounded-xl border border-[#dce7ef] bg-[#f4f7fa] shadow-[0_6px_18px_rgba(57,107,151,0.09)]"
        style={{ width, height }}
      />
    </aside>
  );
}
