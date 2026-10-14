"use client";
// Ambient star field for the opening (2D canvas: far cheaper than WebGL for a backdrop).
// Static under prefers-reduced-motion.
import { useEffect, useRef } from "react";

export function Starfield({
  reducedMotion,
  brightness,
}: {
  reducedMotion: boolean;
  brightness: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const level = useRef(brightness);
  level.current = brightness;

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const small = window.innerWidth < 640;
    const count = small ? 140 : 320;
    let stars: { x: number; y: number; r: number; tw: number; v: number }[] = [];

    const resize = () => {
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: (Math.random() * 1.2 + 0.2) * dpr,
        tw: Math.random() * Math.PI * 2,
        v: (Math.random() * 0.04 + 0.01) * dpr,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const s of stars) {
        const twinkle = reducedMotion ? 0.8 : 0.6 + 0.4 * Math.sin(t / 900 + s.tw);
        ctx.globalAlpha = twinkle * level.current;
        ctx.fillStyle = "#ece6d6";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (!reducedMotion) {
          s.y -= s.v;
          if (s.y < 0) s.y = c.height;
        }
      }
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
  );
}
