"use client";

import { useEffect, useState } from "react";
import { Bear, Panda } from "./mascots";

/**
 * Full-card loader for Server Actions (creating the quiz, grading answers).
 * Cycles through rhyming messages so waiting feels like part of the joke.
 * `role="status"` announces the message to screen readers.
 */
export function FunLoader({ messages, title }: { messages: readonly string[]; title: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 1700);
    return () => window.clearInterval(timer);
  }, [messages.length]);

  return (
    <div role="status" aria-live="polite" className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
      <div className="relative flex items-end gap-1">
        <Bear className="w-28 animate-bob" mood="wink" />
        <Panda className="w-28 animate-bob [animation-delay:0.25s]" />
      </div>
      <h1 className="font-display text-3xl font-bold text-[#17213e]">{title}</h1>
      <div className="flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-3.5 animate-bounce rounded-full bg-[#ff4f81]" style={{ animationDelay: `${i * 140}ms` }} />
        ))}
      </div>
      <p key={index} className="min-h-7 animate-slide-up font-display text-xl font-medium text-[#3b4a6b]">
        {messages[index]}
      </p>
    </div>
  );
}
