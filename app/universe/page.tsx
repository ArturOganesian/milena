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
    title: "The wedding",
    note: "One ceremony, a hundred people, and somehow you were the only thing in the room I remember clearly.",
  },
  {
    title: "Your smile",
    note: "The easy, unbothered kind of smile. It showed up before you even said anything, and it stayed in my head long after.",
  },
  {
    title: "The way you move through a room",
    note: "You talk to everyone like you've known them for years. That kind of warmth can't be faked.",
  },
  {
    title: "Your laugh",
    note: "I heard it once across the tables and immediately forgot whatever sentence I was in the middle of.",
  },
  {
    title: "The way you carry yourself",
    note: "You didn't need to be the loudest person there to be the most noticeable one. You just had this calm, easy confidence.",
  },
  {
    title: "The courage I didn't have",
    note: "I spent the whole evening planning a casual 'hi'. I left without saying a single word. Bold of me, I know.",
  },
  {
    title: "The first message",
    note: "I sent it. Then checked my phone like it owed me money. It did not reply.",
  },
  {
    title: "The silence",
    note: "No reply. Not even a 'who is this?' I've decided that's mysterious, not devastating. Mostly.",
  },
  {
    title: "Your name",
    note: "Milena. I've typed it, deleted it, typed it again. It looks good in my notifications. It would look better.",
  },
  {
    title: "The maybe",
    note: "I like that nothing is decided yet. The maybe of you is already my favorite part of the week.",
  },
  {
    title: "The truth",
    note: "I built an entire website instead of double-texting. That's either romantic or a cry for help. Possibly both.",
  },
  {
    title: "The question",
    note: "Finish the constellation and I'll ask you the one thing that was too much for a text.",
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
    let centerX = 0;
    let centerY = 0;
    let last = performance.now();
    let elapsed = 0;
    let nextShooting = 2200 + Math.random() * 3200;

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
      tint: string;
      bright: boolean;
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
    let nebulaField: HTMLCanvasElement | null = null;
    let galaxyBand: HTMLCanvasElement | null = null;
    let glowSprite: HTMLCanvasElement | null = null;

    const gaussian = () => {
      let u = 0;
      let v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };

    const makeGlowSprite = () => {
      const size = 64;
      const sprite = document.createElement("canvas");
      sprite.width = size;
      sprite.height = size;
      const spriteContext = sprite.getContext("2d");
      if (!spriteContext) return sprite;
      const gradient = spriteContext.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      gradient.addColorStop(0.25, "rgba(255, 240, 250, 0.5)");
      gradient.addColorStop(1, "rgba(255, 220, 240, 0)");
      spriteContext.fillStyle = gradient;
      spriteContext.fillRect(0, 0, size, size);
      return sprite;
    };

    const makeNebulaField = () => {
      const scale = 1.6;
      const field = document.createElement("canvas");
      field.width = Math.ceil(width * scale);
      field.height = Math.ceil(height * scale);
      const fieldContext = field.getContext("2d");
      if (!fieldContext) return field;
      fieldContext.globalCompositeOperation = "lighter";

      const palette = [
        [330, 90, 66, 0.16],
        [290, 85, 62, 0.14],
        [215, 90, 64, 0.13],
        [265, 80, 60, 0.12],
        [190, 85, 62, 0.1],
        [345, 90, 62, 0.11],
        [240, 90, 66, 0.09],
      ];

      for (let i = 0; i < 16; i += 1) {
        const [hue, saturation, lightness, alpha] = palette[i % palette.length];
        const radius =
          Math.max(field.width, field.height) * (0.16 + Math.random() * 0.26);
        const x = Math.random() * field.width;
        const y = Math.random() * field.height;
        const gradient = fieldContext.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(
          0,
          `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`,
        );
        gradient.addColorStop(
          0.45,
          `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.45})`,
        );
        gradient.addColorStop(1, "hsla(0, 0%, 0%, 0)");
        fieldContext.fillStyle = gradient;
        fieldContext.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }

      return field;
    };

    const makeGalaxyBand = () => {
      const band = document.createElement("canvas");
      band.width = Math.ceil(width * 1.7);
      band.height = Math.ceil(height * 1.7);
      const bandContext = band.getContext("2d");
      if (!bandContext) return band;
      const mid = band.height / 2;

      const haze = bandContext.createLinearGradient(0, 0, 0, band.height);
      haze.addColorStop(0, "rgba(120, 100, 200, 0)");
      haze.addColorStop(0.34, "rgba(160, 130, 230, 0.05)");
      haze.addColorStop(0.48, "rgba(240, 220, 255, 0.12)");
      haze.addColorStop(0.52, "rgba(255, 235, 245, 0.1)");
      haze.addColorStop(0.66, "rgba(150, 140, 230, 0.05)");
      haze.addColorStop(1, "rgba(110, 90, 190, 0)");
      bandContext.fillStyle = haze;
      bandContext.fillRect(0, 0, band.width, band.height);

      const dustCount = Math.round((band.width * band.height) / 1000);
      for (let i = 0; i < dustCount; i += 1) {
        const x = Math.random() * band.width;
        const y = mid + gaussian() * band.height * 0.13;
        const radius = 0.3 + Math.random() * 1.1;
        const alpha = 0.08 + Math.random() * 0.5;
        const warm = Math.random() < 0.28;
        bandContext.fillStyle = warm
          ? `rgba(255, 232, 205, ${alpha})`
          : `rgba(225, 225, 255, ${alpha})`;
        bandContext.beginPath();
        bandContext.arc(x, y, radius, 0, Math.PI * 2);
        bandContext.fill();
      }

      for (let i = 0; i < 40; i += 1) {
        const x = Math.random() * band.width;
        const y = mid + gaussian() * band.height * 0.1;
        const radius = 1.4 + Math.random() * 1.8;
        bandContext.fillStyle = `rgba(255, 245, 250, ${
          0.4 + Math.random() * 0.4
        })`;
        bandContext.beginPath();
        bandContext.arc(x, y, radius, 0, Math.PI * 2);
        bandContext.fill();
      }

      return band;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      centerX = width / 2;
      centerY = height / 2;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.round((width * height) / 3200);
      const count = Math.min(650, Math.max(140, target));
      const padX = width * 0.18;
      const padY = height * 0.18;

      stars = Array.from({ length: count }, () => {
        const roll = Math.random();
        const tint =
          roll < 0.2
            ? "255, 214, 235"
            : roll < 0.42
              ? "206, 224, 255"
              : roll < 0.5
                ? "255, 236, 205"
                : "240, 236, 255";
        return {
          x: -padX + Math.random() * (width + padX * 2),
          y: -padY + Math.random() * (height + padY * 2),
          radius: 0.35 + Math.random() * 1.45,
          alpha: 0.18 + Math.random() * 0.55,
          pulse: 0.1 + Math.random() * 0.35,
          speed: 0.4 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          depth: 0.25 + Math.random() * 0.75,
          tint,
          bright: Math.random() < 0.08,
        };
      });

      nebulaField = makeNebulaField();
      galaxyBand = makeGalaxyBand();
      if (!glowSprite) glowSprite = makeGlowSprite();
    };

    const render = (delta: number) => {
      elapsed += delta / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      context.clearRect(0, 0, width, height);

      if (nebulaField) {
        context.save();
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = 0.85;
        context.translate(centerX + pointer.x * 14, centerY + pointer.y * 14);
        context.rotate(Math.sin(elapsed * 0.015) * 0.04 + elapsed * 0.0025);
        context.drawImage(
          nebulaField,
          -nebulaField.width / 2,
          -nebulaField.height / 2,
        );
        context.restore();
      }

      if (galaxyBand) {
        context.save();
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = 0.6;
        context.translate(centerX + pointer.x * 24, centerY + pointer.y * 24);
        context.rotate(-0.42 + Math.sin(elapsed * 0.02) * 0.012 + elapsed * 0.004);
        context.drawImage(
          galaxyBand,
          -galaxyBand.width / 2,
          -galaxyBand.height / 2,
        );
        context.restore();
      }

      context.save();
      context.translate(centerX, centerY);
      context.rotate(elapsed * 0.0045);
      context.translate(-centerX, -centerY);

      for (const star of stars) {
        const twinkle =
          star.alpha + star.pulse * Math.sin(elapsed * star.speed + star.phase);
        const alpha = Math.max(0.04, twinkle);
        const x = star.x + pointer.x * star.depth * 26;
        const y = star.y + pointer.y * star.depth * 26;

        if (star.bright && glowSprite) {
          const size = 10 + star.radius * 10;
          context.globalCompositeOperation = "lighter";
          context.globalAlpha = Math.min(0.8, alpha + 0.15);
          context.drawImage(glowSprite, x - size / 2, y - size / 2, size, size);
          context.globalAlpha = 1;
          context.globalCompositeOperation = "source-over";
        }

        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${star.tint}, ${alpha})`;
        context.fill();
      }

      context.restore();

      if (reduceMotion) return;

      nextShooting -= delta;
      if (nextShooting <= 0) {
        const fromLeft = Math.random() < 0.5;
        shooting.push({
          x: fromLeft ? -60 : width + 60,
          y: Math.random() * height * 0.55,
          vx: (fromLeft ? 1 : -1) * (0.6 + Math.random() * 0.5),
          vy: 0.3 + Math.random() * 0.25,
          life: 0,
          ttl: 1000 + Math.random() * 600,
        });
        nextShooting = 2600 + Math.random() * 4800;
      }

      shooting = shooting.filter((shot) => {
        shot.life += delta;
        shot.x += shot.vx * delta;
        shot.y += shot.vy * delta;
        const progress = shot.life / shot.ttl;
        if (progress >= 1) return false;
        const fade = Math.sin(progress * Math.PI);
        const tailX = shot.x - shot.vx * 220;
        const tailY = shot.y - shot.vy * 220;
        const gradient = context.createLinearGradient(
          shot.x,
          shot.y,
          tailX,
          tailY,
        );
        gradient.addColorStop(0, `rgba(255, 244, 230, ${0.9 * fade})`);
        gradient.addColorStop(1, "rgba(255, 244, 230, 0)");
        context.strokeStyle = gradient;
        context.lineWidth = 1.6;
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
  const [intro, setIntro] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [skyOpen, setSkyOpen] = useState(false);

  const isComplete = found.length === MEMORIES.length;

  const openSky = useCallback(() => {
    setSkyOpen(true);
    setIntroLeaving(true);
    window.setTimeout(() => setIntro(false), 950);
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(openSky, 3900);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setSkyOpen(true);
      setIntro(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [openSky]);

  useEffect(() => {
    if (!intro) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [intro]);

  useEffect(() => {
    if (!intro) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        openSky();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [intro, openSky]);

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
          I saw you once, at my friend&apos;s wedding — and never worked up the
          courage to say hi. So I noticed twelve things from across the room and
          made you a sky.
        </p>
        <span className="mt-5 rounded-full border border-rose-200/15 bg-white/[0.05] px-4 py-1.5 text-[11px] font-medium tracking-wide text-rose-100/85 backdrop-blur">
          {found.length === 0
            ? "Tap the stars — every one is a reason."
            : isComplete
              ? "Every star found. The sky is yours."
              : `${found.length} of ${MEMORIES.length} reasons found`}
        </span>
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
              className={`${
                skyOpen ? "constellation-line" : "opacity-0"
              } transition-[stroke-width,opacity] duration-1000`}
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

      <footer className="relative z-10 flex justify-center px-6 pb-8 sm:pb-10">
        <div className="h-1 w-44 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-amber-200 transition-all duration-700"
            style={{ width: `${(found.length / MEMORIES.length) * 100}%` }}
          />
        </div>
      </footer>

      {intro && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Open Milena's universe"
          onClick={openSky}
          className={`fixed inset-0 z-[60] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#08040f] px-6 ${
            introLeaving ? "intro-leaving" : ""
          }`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(190,24,93,0.28),transparent_55%),radial-gradient(ellipse_at_50%_105%,rgba(76,29,149,0.4),transparent_60%)]"
          />
          <svg
            viewBox="0 0 600 220"
            aria-hidden="true"
            className="relative w-[min(86vw,560px)] overflow-visible"
          >
            <defs>
              <linearGradient id="intro-ink" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fecdd3" />
                <stop offset="55%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
              <linearGradient id="intro-edge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="86%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
              <filter
                id="intro-glow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <mask
                id="intro-reveal"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="600"
                height="220"
              >
                <rect x="0" y="0" width="0" height="220" fill="url(#intro-edge)">
                  <animate
                    attributeName="width"
                    from="0"
                    to="600"
                    dur="2.4s"
                    begin="0.3s"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.33 0 0.67 1"
                  />
                </rect>
              </mask>
            </defs>
            <text
              x="300"
              y="148"
              textAnchor="middle"
              fontFamily="var(--font-great-vibes), cursive"
              fontSize="150"
              fill="url(#intro-ink)"
              filter="url(#intro-glow)"
              mask="url(#intro-reveal)"
            >
              Milena
            </text>
          </svg>
          <p className="intro-caption relative mt-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-rose-200/70">
            a little universe, just for you
          </p>
          <Heart className="intro-heart relative mt-6 h-4 w-4 text-rose-400/80" />
          <span className="intro-hint absolute bottom-10 text-[10px] font-medium uppercase tracking-[0.3em] text-rose-100/50">
            tap anywhere to open
          </span>
        </div>
      )}

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
                Twelve reasons, one wedding, zero replies — and one conclusion:
                I really like you, Milena. No pressure. The universe is yours,
                and the reply is optional.
              </p>
              <a
                href={INSTAGRAM_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="yes-glow mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-7 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
              >
                Give me your answer
                <Heart className="h-4 w-4" />              </a>
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
