"use client";

import { useEffect } from "react";
import { Bear } from "@/components/mascots";
import { Shell } from "@/components/shell";
import { BigButton } from "@/components/ui";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
        <Bear className="w-32" mood="smirk" />
        <h1 className="font-display text-3xl font-bold text-[#17213e]">Whoops, the quiz tripped!</h1>
        <p className="max-w-xs font-display text-lg font-medium text-[#3b4a6b]">Something broke on our side. Give it another go — no need to fret, we&apos;ll get it set!</p>
        <BigButton onClick={reset} noArrow>
          Try again
        </BigButton>
      </div>
    </Shell>
  );
}
