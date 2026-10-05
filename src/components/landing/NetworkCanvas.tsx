"use client";

import { useEffect, useRef } from "react";

/**
 * Animated background for the landing hero: drifting points joined by lines when they come close, like a
 * small neural network. Drawn on a canvas, so there is no video file to load. Stays still for visitors who
 * have asked their device to reduce motion.
 */
export default function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let points: { x: number; y: number; vx: number; vy: number; r: number; hot: boolean }[] = [];
    let frame = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(36, (w * h) / 12000)));
      points = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.8,
        hot: i % 6 === 0,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const reach = 140;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < reach) {
            const alpha = (1 - d / reach) * 0.35;
            ctx.strokeStyle = a.hot || b.hot ? `rgba(220,38,38,${alpha})` : `rgba(148,163,184,${alpha * 0.7})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of points) {
        ctx.fillStyle = p.hot ? "rgba(248,113,113,0.95)" : "rgba(226,232,240,0.7)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.hot ? p.r + 0.8 : p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    resize();
    if (still) draw();
    else frame = requestAnimationFrame(step);

    const onResize = () => {
      resize();
      if (still) draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
