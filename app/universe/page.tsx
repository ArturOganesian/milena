"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const INSTAGRAM_CHAT_URL = "https://ig.me/m/arturoganesianofficial";

type Point = { x: number; y: number };

const HEART_POINTS: Point[] = [
  { x: 50, y: 20 },
  { x: 38, y: 9 },
  { x: 24, y: 12 },
  { x: 13, y: 27 },
  { x: 17, y: 47 },
  { x: 30, y: 65 },
  { x: 50, y: 88 },
  { x: 70, y: 65 },
  { x: 83, y: 47 },
  { x: 87, y: 27 },
  { x: 76, y: 12 },
  { x: 62, y: 9 },
];

const HEART_PATH = `${HEART_POINTS.map(
  (point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
).join(" ")} Z`;

const MEMORIES = [
  {
    title: "The first message",
    note: "I don't remember exactly what I said. I remember that you replied, and the whole day got a little brighter.",
  },
  {
    title: "Your name",
    note: "Milena. I've caught myself saying it just to hear how it sounds. It's a nice name. It's a better excuse.",
  },
  {
    title: "Your laugh",
    note: "The one you do when you're trying not to laugh. That one wins every single time.",
  },
  {
    title: "The way you talk",
    note: "You explain things like they matter, and somehow I end up caring about all of them.",
  },
  {
    title: "Late replies",
    note: "You take your time. I've decided to find that charming instead of stressful.",
  },
  {
    title: "Your taste",
    note: "Whatever you're listening to, reading, watching, I'm quietly taking notes.",
  },
  {
    title: "The little things",
    note: "The pause before you answer. The way you type 'hmm'. The tiny details that shouldn't matter and completely do.",
  },
  {
    title: "Your kindness",
    note: "You're gentle with people in a world that gives no reason to be. I notice.",
  },
  {
    title: "The maybe",
    note: "I like that nothing is decided yet. The maybe of you is already my favorite part of the week.",
  },
  {
    title: "This moment",
    note: "If you're reading this, you're in my little universe now. Thank you for wandering in.",
  },
  {
    title: "The truth",
    note: "I built an entire sky just to avoid double-texting. That's not a joke. That's how much I like you.",
  },
  {
    title: "The question",
    note: "There's one thing I've been trying to ask for a while. Finish the constellation and I'll finally say it properly.",
  },
];

function Heart({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    let width = 0;
    let height = 0;
    let last = performance.now();
    let elapsed = 0;
    let nextShooting = 1600 + Math.random() * 2400;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    type SkyStar = {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      pulse: number;
      speed: number;
      phase: number;
      depth: number;
      warm: boolean;
    };

    type Shooting = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      ttl: number;
    };

    let stars: SkyStar[] = [];
    let shooting: Shooting[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.round((width * height) / 7000);
      const count = Math.min(300, Math.max(80, target));

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.4 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.5,
        pulse: 0.12 + Math.random() * 0.32,
        speed: 0.6 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        depth: 0.25 + Math.random() * 0.75,
        warm: Math.random() < 0.35,
      }));
    };

    const render = (delta: number) => {
      elapsed += delta / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const twinkle =
          star.alpha + star.pulse * Math.sin(elapsed * star.speed + star.phase);
        const offsetX = pointer.x * star.depth * 26;
        const offsetY = pointer.y * star.depth * 26;
        context.beginPath();
        context.arc(
          star.x + offsetX,
          star.y + offsetY,
          star.radius,
          0,
          Math.PI * 2,
        );
        context.fillStyle = star.warm
          ? `rgba(255, 236, 210, ${Math.max(0.05, twinkle)})`
          : `rgba(244, 214, 255, ${Math.max(0.05, twinkle)})`;
        context.fill();
      }

      if (reduceMotion) return;

      nextShooting -= delta;
      if (nextShooting <= 0) {
        const fromLeft = Math.random() < 0.5;
        shooting.push({
          x: fromLeft ? -40 : width + 40,
          y: Math.random() * height * 0.5,
          vx: (fromLeft ? 1 : -1) * (0.55 + Math.random() * 0.4),
          vy: 0.35 + Math.random() * 0.2,
          life: 0,
          ttl: 900 + Math.random() * 500,
        });
        nextShooting = 2800 + Math.random() * 4200;
      }

      shooting = shooting.filter((shot) => {
        shot.life += delta;
        shot.x += shot.vx * delta;
        shot.y += shot.vy * delta;
        const progress = shot.life / shot.ttl;
        if (progress >= 1) return false;
        const fade = Math.sin(progress * Math.PI);
        const tailX = shot.x - shot.vx * 160;
        const tailY = shot.y - shot.vy * 160;
        const gradient = context.createLinearGradient(
          shot.x,
          shot.y,
          tailX,
          tailY,
        );
        gradient.addColorStop(0, `rgba(255, 244, 230, ${0.9 * fade})`);
        gradient.addColorStop(1, "rgba(255, 244, 230, 0)");
        context.strokeStyle = gradient;
        context.lineWidth = 1.4;
        context.beginPath();
        context.moveTo(shot.x, shot.y);
        context.lineTo(tailX, tailY);
        context.stroke();
        return true;
      });
    };

    const loop = (now: number) => {
      const delta = Math.min(48, now - last);
      last = now;
      render(delta);
      frame = window.requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = event.clientX / Math.max(1, window.innerWidth) - 0.5;
      pointer.ty = event.clientY / Math.max(1, window.innerHeight) - 0.5;
    };

    const onResize = () => {
      resize();
      if (reduceMotion) render(0);
    };

    resize();
    render(0);

    if (!reduceMotion) {
      last = performance.now();
      frame = window.requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export default function UniversePage() {
  const [found, setFound] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [finale, setFinale] = useState(false);

  const isComplete = found.length === MEMORIES.length;

  const openMemory = (index: number) => {
    setActive(index);
    setFound((previous) =>
      previous.includes(index) ? previous : [...previous, index],
    );
  };

  const closeMemory = useCallback(() => {
    setActive((current) => {
      if (current === null) return current;
      if (found.length === MEMORIES.length) setFinale(true);
      return null;
    });
  }, [found.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (active !== null) closeMemory();
      else if (finale) setFinale(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, finale, closeMemory]);

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#08040f] text-rose-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_8%,rgba(131,64,140,0.4),transparent_55%),radial-gradient(ellipse_at_82%_18%,rgba(190,24,93,0.3),transparent_52%),radial-gradient(ellipse_at_50%_108%,rgba(76,29,149,0.45),transparent_62%)]"
      />
      <Starfield />

      <header className="relative z-10 flex flex-col items-center px-6 pb-2 pt-8 text-center sm:pt-12">
        <Link
          href="/"
          className="absolute left-5 top-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-rose-200/50 transition-colors hover:text-rose-100"
        >
          ← home
        </Link>
        <span className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-rose-300/70">
          <span className="h-px w-6 bg-rose-300/30" />
          for Milena
          <span className="h-px w-6 bg-rose-300/30" />
        </span>
        <h1 className="fade-up mt-4 font-serif text-4xl italic leading-tight tracking-tight text-rose-50 sm:text-6xl">
          Milena&apos;s little universe
        </h1>
        <p className="fade-up mt-4 max-w-md text-sm leading-relaxed text-rose-100/60">
          Some things are too big for a text message. So I made you a sky — twelve
          stars, one for every reason.
        </p>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-4 sm:py-6">
        <div className="relative aspect-square w-[min(88vw,540px)]">
          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="heart-line" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fda4af" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#f0abfc" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#fde68a" stopOpacity="0.9" />
              </linearGradient>
              <filter
                id="heart-glow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="1.3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d={HEART_PATH}
              fill="none"
              stroke="url(#heart-line)"
              strokeWidth={isComplete ? 0.7 : 0.45}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              filter="url(#heart-glow)"
              className="constellation-line transition-[stroke-width] duration-1000"
            />
          </svg>

          {HEART_POINTS.map((point, index) => {
            const discovered = found.includes(index);
            return (
              <button
                key={index}
                type="button"
                onClick={() => openMemory(index)}
                aria-label={`Open reason ${index + 1}: ${MEMORIES[index].title}`}
                className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full p-3 focus:outline-none"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <span className="relative block">
                  <span
                    className="star-breathe absolute -inset-2 rounded-full"
                    style={{
                      animationDelay: `${index * 0.32}s`,
                      background: discovered
                        ? "radial-gradient(circle, rgba(251,113,133,0.45), transparent 70%)"
                        : "radial-gradient(circle, rgba(253,230,138,0.32), transparent 70%)",
                    }}
                  />
                  <span
                    className={`relative block rounded-full transition-all duration-500 ${
                      discovered
                        ? "h-3.5 w-3.5 bg-rose-200 shadow-[0_0_18px_6px_rgba(251,113,133,0.5)]"
                        : "h-2.5 w-2.5 bg-amber-100/90 shadow-[0_0_12px_4px_rgba(253,230,138,0.3)]"
                    } group-hover:scale-125 group-focus-visible:ring-2 group-focus-visible:ring-rose-300 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#08040f]`}
                  />
                </span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-medium tracking-wide text-rose-100 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {discovered ? MEMORIES[index].title : "?"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="relative z-10 px-6 pb-8 text-center sm:pb-10">
        <div className="mx-auto h-1 w-44 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-amber-200 transition-all duration-700"
            style={{ width: `${(found.length / MEMORIES.length) * 100}%` }}
          />
        </div>
        <p className="mt-3 text-[11px] tracking-wide text-rose-100/55">
          {found.length === 0
            ? "Tap the stars — every one is a reason."
            : isComplete
              ? "Every star found. The sky is yours."
              : `${found.length} of ${MEMORIES.length} reasons found`}
        </p>
      </footer>

      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="memory-title"
          onClick={closeMemory}
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="pop-in relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-rose-200/15 bg-[#170a1f]/95 p-7 text-left shadow-[0_30px_100px_-20px_rgba(190,24,93,0.6)] sm:p-8"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/25 blur-3xl"
            />
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-rose-300/70">
              star {active + 1} of {MEMORIES.length}
            </p>
            <h2
              id="memory-title"
              className="mt-3 font-serif text-2xl italic text-rose-50"
            >
              {MEMORIES[active].title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-rose-100/80">
              {MEMORIES[active].note}
            </p>
            <button
              type="button"
              onClick={closeMemory}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
            >
              {isComplete ? "Finish the constellation" : "Back to the sky"}
            </button>
          </div>
        </div>
      )}

      {finale && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="finale-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#08040f]/85 px-5 backdrop-blur-md"
        >
          <div className="pop-in relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-rose-200/20 bg-gradient-to-b from-[#24102a]/95 to-[#12071a]/95 p-8 text-center shadow-[0_30px_120px_-20px_rgba(244,63,94,0.55)] sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <Heart className="heart-float left-[12%] h-5 w-5" />
              <Heart className="heart-float left-[34%] h-4 w-4 opacity-70" />
              <Heart className="heart-float left-[58%] h-6 w-6 opacity-60" />
              <Heart className="heart-float left-[78%] h-4 w-4 opacity-80" />
              <Heart className="heart-float left-[90%] h-5 w-5 opacity-50" />
            </div>
            <div className="relative">
              <Heart className="mx-auto h-14 w-14 text-rose-400 drop-shadow-[0_0_20px_rgba(251,113,133,0.7)]" />
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-rose-300/80">
                every star found
              </p>
              <h2
                id="finale-title"
                className="mt-4 font-serif text-3xl italic leading-tight text-rose-50 sm:text-4xl"
              >
                You just mapped my whole heart.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-rose-100/80">
                Twelve reasons, one conclusion: I really like you, Milena. The only
                thing left in this universe is your answer.
              </p>
              <a
                href={INSTAGRAM_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="yes-glow mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-7 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
              >
                Give me your answer
                <Heart className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => setFinale(false)}
                className="mx-auto mt-5 block text-[11px] font-medium uppercase tracking-[0.25em] text-rose-200/60 underline underline-offset-4 transition-colors hover:text-rose-100"
              >
                stay in the sky
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
