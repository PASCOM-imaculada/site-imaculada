"use client";

import React, { useEffect, useRef } from "react";

export function CandleEmbersCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let isVisible = false;

    interface Ember {
      x: number;
      y: number;
      radius: number;
      vy: number;
      vx: number;
      alpha: number;
      pulse: number;
    }

    const embers: Ember[] = [];
    const EMBER_COUNT = 38;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resize();

    const width = () => canvas.offsetWidth;
    const height = () => canvas.offsetHeight;

    for (let i = 0; i < EMBER_COUNT; i++) {
      embers.push({
        x: Math.random() * width(),
        y: Math.random() * height(),
        radius: 1.2 + Math.random() * 2.6,
        vy: -(0.22 + Math.random() * 0.55),
        vx: (Math.random() - 0.5) * 0.3,
        alpha: 0.15 + Math.random() * 0.55,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function render() {
      if (!ctx || !canvas || !isVisible) return;
      const w = width();
      const h = height();

      ctx.clearRect(0, 0, w, h);

      for (const e of embers) {
        e.y += e.vy;
        e.x += e.vx + Math.sin(e.pulse) * 0.18;
        e.pulse += 0.025;

        if (e.y < -10) {
          e.y = h + 10;
          e.x = Math.random() * w;
        }

        const currentAlpha =
          e.alpha * (0.65 + 0.35 * Math.sin(e.pulse));

        const grad = ctx.createRadialGradient(
          e.x,
          e.y,
          0,
          e.x,
          e.y,
          e.radius * 4
        );
        grad.addColorStop(0, `rgba(244, 185, 66, ${currentAlpha})`);
        grad.addColorStop(0.5, `rgba(200, 155, 60, ${currentAlpha * 0.45})`);
        grad.addColorStop(1, "rgba(200, 155, 60, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              animationFrameId = requestAnimationFrame(render);
            }
          } else {
            isVisible = false;
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    window.addEventListener("resize", resize);

    return () => {
      isVisible = false;
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full"
    />
  );
}
