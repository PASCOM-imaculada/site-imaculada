"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (elements.length === 0) return;

    for (const el of elements) {
      const delay = el.dataset.revealDelay;
      if (delay) {
        el.style.transitionDelay = `${delay}ms`;
      }
    }

    if (!("IntersectionObserver" in window)) {
      for (const el of elements) {
        el.classList.add("is-visible");
      }
      return;
    }

    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else if (entry.boundingClientRect.top > window.innerHeight * 0.88) {
            // Se o usuário voltar para cima, esconde novamente para surgir de novo ao descer
            entry.target.classList.remove("is-visible");
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: isMobile ? "0px 0px -16% 0px" : "0px 0px -10% 0px",
      }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return <>{children}</>;
}
