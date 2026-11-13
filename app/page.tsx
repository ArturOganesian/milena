"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const INSTAGRAM_CHAT_URL = "https://ig.me/m/arturoganesianofficial";

const DODGE_LINES = [
  "Take your time. I'll wait. The No button won't.",
  "Interesting strategy. The button is still not letting you click it.",
  "The No button seems a little shy today.",
  "The No button has filed a restraining order.",
  "At this point, the Yes button is the only one left.",
  "The universe is trying to tell you something, Milena.",
];

const HEARTS = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  delay: `${(i % 8) * 0.9}s`,
  duration: `${10 + (i % 5) * 2}s`,
  size: 12 + (i % 4) * 6,
  opacity: 0.15 + (i % 3) * 0.1,
}));

function Heart({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export default function Home() {
  const noRef = useRef<HTMLButtonElement>(null);
  const yesRef = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dodges, setDodges] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const dodge = useCallback(() => {
    const el = noRef.current;
    if (!el) return;

    const pad = 16;
    const w = el.offsetWidth || 128;
    const h = el.offsetHeight || 56;
    const maxX = Math.max(pad, window.innerWidth - w - pad);
    const maxY = Math.max(pad, window.innerHeight - h - pad);
    const yesRect = yesRef.current?.getBoundingClientRect();
    const safeRadius = Math.min(220, Math.max(140, window.innerWidth * 0.25));

    let x = pad;
    let y = pad;

    for (let attempt = 0; attempt < 40; attempt += 1) {
      x = pad + Math.random() * (maxX - pad);
      y = pad + Math.random() * (maxY - pad);
      if (!yesRect) break;

      const dx = x + w / 2 - (yesRect.left + yesRect.width / 2);
      const dy = y + h / 2 - (yesRect.top + yesRect.height / 2);
      if (Math.hypot(dx, dy) > safeRadius) break;
    }

    setPos({ x, y });
    setDodges((count) => count + 1);
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const el = noRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const threshold = Math.max(rect.width, rect.height) / 2 + 36;

      if (Math.hypot(dx, dy) < threshold) dodge();
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [dodge]);

  useEffect(() => {
    if (!celebrating) return;
    const timer = window.setTimeout(() => setCelebrating(false), 6000);
    return () => window.clearTimeout(timer);
  }, [celebrating]);

  const yesScale = 1 + Math.min(dodges, 6) * 0.05;

  const noButton = (
    <button
      key={dodges}
      ref={noRef}
      type="button"
      tabIndex={-1}
      aria-label="No (good luck clicking this)"
      onPointerEnter={dodge}
      onPointerDown={(event) => {
        event.preventDefault();
        dodge();
      }}
      onFocus={dodge}
      onClick={(event) => {
        event.preventDefault();
        dodge();
      }}
      style={
        pos
          ? {
              position: "fixed",
              left: pos.x,
              top: pos.y,
              zIndex: 40,
            }
          : undefined
      }
      className={`inline-flex h-14 w-32 items-center justify-center rounded-full border border-rose-200 bg-white text-base font-semibold text-rose-500 shadow-sm transition-colors hover:border-rose-300 hover:text-rose-600 ${
        pos ? "no-dodge" : ""
      }`}
    >
      No
    </button>
  );

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
        {HEARTS.map((heart, index) => (
          <Heart
            key={index}
            className="heart-float"
            style={{
              left: heart.left,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
              width: heart.size,
              height: heart.size,
              opacity: heart.opacity,
            }}
          />
        ))}
      </div>

      <section className="fade-up relative w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/70 p-6 text-center shadow-[0_30px_80px_-30px_rgba(190,24,93,0.35)] backdrop-blur-xl sm:p-10">
        <div className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-400">
          <span className="h-px w-8 bg-rose-200" />
          for Milena
          <span className="h-px w-8 bg-rose-200" />
        </div>

        <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-rose-950 sm:text-5xl">
          Milena,
          <br />
          <span className="italic text-rose-500">will you finally reply?</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-rose-900/70">
          I sent you a message on Instagram. Then another one. Then, instead of
          double-texting I built an entire website. So&hellip; here we are.
        </p>

        <div className="mx-auto mt-6 w-full max-w-sm space-y-2 text-left">
          <div className="w-fit rounded-2xl rounded-bl-md bg-rose-100/80 px-4 py-2 text-sm text-rose-900">
            hey Milena, are you around?
          </div>
          <div className="w-fit rounded-2xl rounded-bl-md bg-rose-100/80 px-4 py-2 text-sm text-rose-900">
            i have one very important question for you
          </div>
          <div className="ml-auto w-fit pr-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-400">
            Seen
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            ref={yesRef}
            href={INSTAGRAM_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setCelebrating(true)}
            style={{ transform: `scale(${yesScale})` }}
            className="yes-glow inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-7 text-base font-semibold text-white transition-transform duration-300 hover:brightness-105 active:scale-95"
          >
            Yes, I&apos;ll reply
            <Heart className="h-4 w-4" />
          </a>

          <div className="h-14 w-32">{pos === null ? noButton : null}</div>
        </div>

        <p className="mt-6 min-h-10 text-sm text-rose-900/60">
          {dodges > 0
            ? DODGE_LINES[Math.min(dodges, DODGE_LINES.length) - 1]
            : "One of these buttons is much easier to press than the other."}
        </p>

        {dodges > 0 && (
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-400">
            No-button escapes: {dodges}
          </p>
        )}

        <p className="mt-8 border-t border-rose-100 pt-5 text-xs leading-relaxed text-rose-900/50">
          P.S. You can always just reply to my message. But this felt more
          romantic.
        </p>

        <Link
          href="/universe"
          className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-400 underline-offset-4 transition-colors hover:text-rose-500 hover:underline"
        >
          enter your little universe →
        </Link>
      </section>

      {pos !== null && createPortal(noButton, document.body)}

      {celebrating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-500/95 via-pink-500/95 to-fuchsia-600/95 px-6 text-center text-white backdrop-blur-md">
          <div className="pop-in max-w-md">
            <Heart className="mx-auto h-16 w-16 animate-bounce" />
            <h2 className="mt-6 font-serif text-4xl italic leading-tight sm:text-5xl">
              You just made my day.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/90">
              Taking you to our chat&hellip; send me that message, Milena.
            </p>
            <a
              href={INSTAGRAM_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-rose-600 shadow-lg transition-transform hover:scale-[1.03]"
            >
              Open our chat
            </a>
            <button
              type="button"
              onClick={() => setCelebrating(false)}
              className="mx-auto mt-5 block text-xs font-medium uppercase tracking-[0.2em] text-white/80 underline underline-offset-4"
            >
              back
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
