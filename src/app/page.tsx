"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  Flame,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { useParish } from "@/context/ParishContext";
import { CandleEmbersCanvas } from "@/components/CandleEmbersCanvas";
import { asset } from "@/lib/asset";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Posição (em pixels da foto original) das estrelas da auréola
const HALO_STARS = [
  [690, 22], [745, 32], [790, 60], [822, 100], [838, 152], [830, 205], [802, 250],
  [582, 253], [552, 210], [544, 157], [560, 107], [592, 65], [635, 35],
];

// "Sábado – 08h às 12h" vira ["Sábado", "08h às 12h"]
function splitHours(text: string) {
  const idx = text.indexOf(" – ");
  return [text.slice(0, idx), text.slice(idx + 3)];
}

export default function HomePage() {
  const { data } = useParish();
  const { parishInfo, massSchedules } = data;
  const [copiedPix, setCopiedPix] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const heroPinRef = useRef<HTMLDivElement>(null);
  const heroFigureRef = useRef<HTMLDivElement>(null);
  const heroTitleGroupRef = useRef<HTMLDivElement>(null);

  const scheduleSectionRef = useRef<HTMLDivElement>(null);
  const lastSupperBgRef = useRef<HTMLImageElement>(null);

  const candlePinRef = useRef<HTMLDivElement>(null);
  const candleGlowRef = useRef<HTMLDivElement>(null);

  const parocoSectionRef = useRef<HTMLElement>(null);
  const parocoBgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(rootRef);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. ABERTURA — a imagem desce mais devagar que a página e o título se despede
      if (heroPinRef.current && heroFigureRef.current) {
        gsap.to(heroFigureRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: heroPinRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (heroPinRef.current && heroTitleGroupRef.current) {
        gsap.to(heroTitleGroupRef.current, {
          y: -60,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroPinRef.current,
            start: "top top",
            end: "55% top",
            scrub: true,
          },
        });
      }

      // 2. DESENHO DA ÚLTIMA CEIA (Parallax contínuo no Scroll)
      if (scheduleSectionRef.current && lastSupperBgRef.current) {
        gsap.fromTo(
          lastSupperBgRef.current,
          { scale: 1.07, yPercent: 5 },
          {
            scale: 1,
            yPercent: -4,
            ease: "none",
            scrollTrigger: {
              trigger: scheduleSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // 3. CAPELA DAS VELAS — acendem enquanto a seção chega, sem travar a rolagem
      if (candlePinRef.current) {
        const flames = gsap.utils.toArray<HTMLElement>(".gsap-candle-flame");
        const halos = gsap.utils.toArray<HTMLElement>(".gsap-candle-halo");

        const candleTl = gsap.timeline({
          scrollTrigger: {
            trigger: candlePinRef.current,
            start: "top 75%",
            end: "top 10%",
            scrub: true,
          },
        });

        const ignitionOrder = [3, 2, 4, 1, 5, 0, 6];

        ignitionOrder.forEach((candleIdx, step) => {
          const startTime = step * 0.09;
          if (flames[candleIdx]) {
            candleTl.fromTo(
              flames[candleIdx],
              { opacity: 0, scale: 0.1, y: 12 },
              { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "back.out(2)" },
              startTime
            );
          }
          if (halos[candleIdx]) {
            candleTl.fromTo(
              halos[candleIdx],
              { opacity: 0, scale: 0.2 },
              { opacity: 0.65, scale: 1.25, duration: 0.3, ease: "power2.out" },
              startTime
            );
          }
        });

        if (candleGlowRef.current) {
          candleTl.fromTo(
            candleGlowRef.current,
            { opacity: 0.08, scale: 0.6 },
            { opacity: 0.75, scale: 1.25, duration: 0.8, ease: "power2.out" },
            0
          );
        }
      }

      // 4. SEÇÃO DO PÁROCO — parallax dos anjos
      if (parocoSectionRef.current && parocoBgRef.current) {
        gsap.fromTo(
          parocoBgRef.current,
          { scale: 1.1, yPercent: 6 },
          {
            scale: 1,
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: parocoSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    });

    // 5. CARTÕES EMPILHADOS — só onde eles cabem inteiros na tela
    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 768px) and (min-height: 640px)",
      () => {
        const stackCards = gsap.utils.toArray<HTMLElement>(".gsap-stack-card");
        stackCards.forEach((card, i) => {
          if (i < stackCards.length - 1) {
            gsap.to(card, {
              scale: 0.96,
              ease: "none",
              scrollTrigger: {
                trigger: stackCards[i + 1],
                start: "top 85%",
                end: "top 22%",
                scrub: true,
              },
            });
          }
        });
      }
    );

    return () => mm.revert();
  }, []);

  async function handleCopyPix() {
    try {
      await navigator.clipboard.writeText(parishInfo.pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    } catch {
      setCopiedPix(false);
    }
  }

  const whatsappUrl = `https://wa.me/${parishInfo.whatsappNumber}?text=${encodeURIComponent(
    "Olá! Paz e Bem. Gostaria de falar com a Secretaria da Paróquia da Imaculada."
  )}`;

  const confessionWhatsappUrl = `https://wa.me/${parishInfo.whatsappNumber}?text=${encodeURIComponent(
    "Olá, tudo bem? Gostaria de marcar um horário para me confessar."
  )}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Paróquia da Imaculada Praça Professor Paulo José Otaviano 2 São Bernardo Campinas SP 13030-629"
  )}`;

  return (
    <div ref={rootRef} className="bg-[#FAF8F5] text-[#0F2236]">
      {/* =======================================================================
          ATO I — PRIMEIRA TELA (100% TELA CHEIA COM A ESCULTURA REAL DA IMACULADA
          E ESCRITO "PARÓQUIA DA Imaculada" FIEL À REFERÊNCIA DO USUÁRIO)
         ======================================================================= */}
      <section
        ref={heroPinRef}
        aria-label="Paróquia da Imaculada"
        className="relative h-dvh w-full overflow-hidden flex items-end justify-center bg-[#FAF8F5]"
      >
        <div aria-hidden="true" className="hero-wall absolute inset-0" />

        {/* Faixa atrás da barra do topo, na mesma cor da parede da imagem */}
        <div
          aria-hidden="true"
          className="hero-strip absolute inset-x-0 top-0 h-28 bg-[#5E4B38]"
        />

        {/* A imagem é dimensionada para manter a auréola e as mãos sempre visíveis */}
        <div className="absolute inset-x-0 top-12 flex justify-center pointer-events-none">
          <div
            ref={heroFigureRef}
            className="hero-figure relative shrink-0 will-change-transform"
          >
            <img
              src={asset("/images/imaculada-statue-hero-original.jpg")}
              alt="Imagem de Nossa Senhora da Imaculada Conceição de braços abertos com auréola de doze estrelas"
              width={1376}
              height={768}
              fetchPriority="high"
              className="hero-image block w-full h-auto select-none"
            />
            <div aria-hidden="true" className="hero-vignette absolute inset-0" />
            <div aria-hidden="true" className="hero-glow absolute" />
            {HALO_STARS.map(([x, y], idx) => (
              <span
                key={idx}
                aria-hidden="true"
                className="hero-star absolute"
                style={{
                  left: `${(x / 1376) * 100}%`,
                  top: `${(y / 768) * 100}%`,
                  animationDelay: `${idx * 0.55}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Nuvens em movimento lento e passagem contínua para a seção seguinte */}
        <div aria-hidden="true" className="hero-cloud hero-cloud-back absolute" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-1 h-[30dvh] bg-gradient-to-t from-[#FAF8F5] from-20% via-[#FAF8F5]/85 via-55% to-transparent"
        />
        <div aria-hidden="true" className="hero-cloud hero-cloud-front absolute" />

        <div
          ref={heroTitleGroupRef}
          className="relative z-20 w-full max-w-5xl mx-auto px-4 pb-[max(1.25rem,3dvh)] text-center flex flex-col items-center"
        >
          <h1 className="flex flex-col items-center">
            <span
              style={{ fontFamily: "var(--font-condensed)" }}
              className="hero-eyebrow font-normal tracking-[0.28em] text-[#1C2730] uppercase pl-[0.28em]"
            >
              PARÓQUIA DA
            </span>
            <span
              style={{ fontFamily: "var(--font-script)" }}
              className="hero-script leading-[1.02] text-[#613B20] px-4 -mt-1"
            >
              Imaculada
            </span>
          </h1>

          <div className="hero-actions mt-2 sm:mt-3 flex flex-col items-center gap-2.5">
            <a
              href="#horarios"
              className="inline-flex min-h-11 items-center gap-2 px-6 py-2.5 rounded-full bg-[#0E2A47] hover:bg-[#1B4965] text-[#FAF8F5] font-semibold text-sm transition-colors"
            >
              <span>Ver horários das missas</span>
              <ArrowDown aria-hidden="true" className="w-4 h-4" />
            </a>
            <span className="hero-location text-xs tracking-[0.22em] uppercase text-[#334E68] font-medium">
              Campinas · São Paulo
            </span>
          </div>
        </div>
      </section>

      {/* Jaculatória: pausa de oração entre a abertura e os horários */}
      <section
        aria-label="Jaculatória"
        className="bg-[#FAF8F5] px-6 pt-10 pb-6 sm:pt-16 sm:pb-8 text-center"
      >
        <p
          data-reveal=""
          className="mx-auto font-display text-xl sm:text-3xl font-semibold text-[#0E2A47] max-w-3xl leading-snug"
        >
          “Ó Maria concebida sem pecado, rogai por nós que recorremos a Vós.”
        </p>
      </section>

      {/* =======================================================================
          ATO II — HORÁRIOS DAS MISSAS, IGREJA ABERTA E CONFISSÕES
          (Fundo com Desenho de Jesus na Última Ceia com o Pão e o Vinho + Cards Surgindo ao Descer)
         ======================================================================= */}
      <section
        id="horarios"
        ref={scheduleSectionRef}
        aria-label="Horários das Missas, Igreja Aberta e Confissões"
        className="relative bg-[#FAF8F5]"
      >
        {/* Fundo Fixo com Desenho de Jesus na Última Ceia (Pão e Vinho) */}
        <div
          aria-hidden="true"
          className="sticky top-0 h-dvh w-full overflow-hidden pointer-events-none -mb-[100dvh]"
        >
          <img
            ref={lastSupperBgRef}
            src={asset("/images/horarios-ultima-ceia.jpg")}
            alt=""
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-left select-none will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF8F5]/35 to-[#FAF8F5]/88" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FAF8F5] from-20% via-[#FAF8F5]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAF8F5] to-transparent" />
        </div>

        <div className="relative z-10 py-24 sm:py-36 px-4 sm:px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Coluna Esquerda Livre para Deixar o Desenho de Jesus na Última Ceia Visível */}
          <div aria-hidden="true" className="hidden lg:block lg:col-span-5" />

          {/* Coluna Direita: Título "Horários das Missas" + Cards que Surgem Suavemente */}
          <div className="lg:col-span-7 space-y-6">
            <div data-reveal="" className="pb-2">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0E2A47]">
                Horários das Missas
              </h2>
            </div>

            {/* Cards dos Dias de Missa */}
            {massSchedules.map((item) => {
              const isFirstFriday =
                item.id === "primeira-sexta" ||
                item.day.toLowerCase().includes("sexta");

              return (
                <article
                  key={item.id}
                  data-reveal=""
                  className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F5]/95 border border-[#C89B3C]/35 shadow-[0_14px_34px_rgba(14,42,71,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-display text-2xl sm:text-[1.75rem] font-semibold text-[#0E2A47]">
                      {item.day}
                    </h3>
                    {isFirstFriday && (
                      <p className="text-sm sm:text-base font-medium text-[#334E68]">
                        Sagrado Coração de Jesus
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {item.times.map((time) => (
                      <span
                        key={time}
                        className="tabular-nums px-5 py-2.5 rounded-xl bg-[#0E2A47] text-[#FAF8F5] font-semibold text-lg sm:text-xl border border-[#C89B3C]/60 shadow-xs"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}

            {/* Card Separado 1: Igreja Aberta */}
            <article
              data-reveal=""
              className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F5]/94 backdrop-blur-md border border-[#C89B3C]/35 shadow-[0_14px_34px_rgba(14,42,71,0.06)] space-y-4"
            >
              <h2 className="font-display text-2xl sm:text-[1.75rem] font-semibold text-[#0E2A47]">
                Igreja Aberta
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-[#0F2236] tabular-nums">
                <div className="p-4 rounded-xl bg-[#F3EFE6]/90 border border-[#0E2A47]/10">
                  <p className="font-semibold text-[#0E2A47]">
                    {splitHours(parishInfo.churchOpenHours.weekdays)[0]}
                  </p>
                  <p className="mt-1 text-[#334E68]">
                    {splitHours(parishInfo.churchOpenHours.weekdays)[1]}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F3EFE6]/90 border border-[#0E2A47]/10">
                  <p className="font-semibold text-[#0E2A47]">
                    {splitHours(parishInfo.churchOpenHours.saturday)[0]}
                  </p>
                  <p className="mt-1 text-[#334E68]">
                    {splitHours(parishInfo.churchOpenHours.saturday)[1]}
                  </p>
                </div>
              </div>
            </article>

            {/* Card Separado 2: Confissões */}
            <article
              data-reveal=""
              className="p-6 sm:p-8 rounded-2xl bg-[#0E2A47] text-[#FAF8F5] border border-[#C89B3C]/60 shadow-[0_18px_40px_rgba(14,42,71,0.16)] flex flex-col sm:flex-row sm:items-center justify-between gap-5"
            >
              <div className="space-y-1">
                <h2 className="font-display text-2xl sm:text-[1.75rem] font-semibold text-[#FAF8F5]">
                  Confissões
                </h2>
                <p className="text-sm sm:text-base text-[#F1ECE1]/85">
                  Agende seu horário pelo WhatsApp.
                </p>
              </div>
              <a
                href={confessionWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#C89B3C] hover:bg-[#d8ab4c] text-[#0E2A47] font-semibold text-sm shrink-0 transition-colors"
              >
                <span>Marcar horário de Confissão</span>
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* =======================================================================
          ATO III — CAPELA DAS VELAS EM CANVAS 60FPS (7 Velas Acesas no Scroll)
         ======================================================================= */}
      <section
        ref={candlePinRef}
        aria-label="Capela das Velas Interativa"
        className="relative min-h-dvh w-full overflow-hidden bg-[#0E2A47] text-[#FAF8F5] flex flex-col items-center justify-center px-4 sm:px-6 py-20"
      >
        <CandleEmbersCanvas />

        <div
          ref={candleGlowRef}
          aria-hidden="true"
          className="pointer-events-none absolute w-[24rem] h-[24rem] sm:w-[36rem] sm:h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(244,185,66,0.34)_0%,rgba(200,155,60,0.08)_50%,transparent_72%)]"
        />

        <div
          aria-hidden="true"
          className="relative z-10 flex items-end justify-center gap-3 sm:gap-6 md:gap-8 mb-12"
        >
          {[76, 94, 112, 134, 112, 94, 76].map((heightPx, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative h-14 flex items-end justify-center">
                <div className="gsap-candle-halo absolute -top-2 w-10 h-10 rounded-full bg-[#F4B942]/35 blur-sm" />
                <div className="gsap-candle-flame w-4 sm:w-5 h-8 sm:h-10 rounded-full bg-gradient-to-t from-[#C89B3C] via-[#F4B942] to-[#FAF8F5] shadow-[0_0_22px_#F4B942] animate-candle-flame" />
              </div>
              <div className="w-0.5 h-2 bg-[#C89B3C]" />
              <div
                style={{ height: `${heightPx}px` }}
                className="w-7 sm:w-10 rounded-t-md bg-gradient-to-b from-[#FAF8F5] via-[#F3EFE6] to-[#D8CEBE] border border-[#C89B3C]/40 shadow-[0_14px_32px_rgba(0,0,0,0.45)]"
              />
            </div>
          ))}
        </div>

        <div
          className="relative z-10 max-w-2xl mx-auto text-center space-y-5"
        >
          <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#FAF8F5]">
            Velário Virtual da Imaculada
          </h2>
          <p className="text-base sm:text-lg text-[#F1ECE1]/90 leading-relaxed">
            Como no velário de Aparecida do Norte, acenda sua vela e deixe sua
            intenção de oração.
          </p>
          <div className="pt-2">
            <Link
              href="/velario"
              className="inline-flex min-h-12 items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#C89B3C] hover:bg-[#d8ab4c] text-[#0E2A47] font-bold text-base shadow-[0_10px_28px_rgba(200,155,60,0.35)] transition-colors"
            >
              <Flame aria-hidden="true" className="w-5 h-5" />
              <span>Acender Minha Vela de Intenção</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =======================================================================
          ATO IV — VENHA CONHECER MAIS SOBRE NOSSA PARÓQUIA (GSAP Stacked Cards)
         ======================================================================= */}
      <section className="py-24 sm:py-36 px-4 sm:px-6 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto space-y-14">
          <div data-reveal="" className="max-w-3xl">
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#0E2A47]">
              Venha conhecer mais sobre nossa paróquia
            </h2>
          </div>

          <div className="space-y-10">
            {[
              {
                title: "Sacramentos da Igreja",
                desc: "Orientações completas, preparação e documentos necessários para Batismo, Primeira Eucaristia, Crisma, Confissão, Matrimônio e Unção dos Enfermos.",
                cta: "Consultar Guia dos Sacramentos",
                href: "/sacramentos",
                image: "/images/sacramentos-real-crop.jpg",
                imageAlt:
                  "Ostensório exposto para Adoração ao Santíssimo na Matriz",
                imageClass: "object-cover object-center",
                theme: "bg-[#F3EFE6] text-[#0F2236] border-[#0E2A47]/15",
              },
              {
                title: "Pastorais e Movimentos",
                desc: "Venha conhecer mais sobre os ofícios, pastorais e movimentos da nossa comunidade e saiba como participar.",
                cta: "Conhecer Pastorais e Participar",
                href: "/pastorais",
                image: "/images/altar-imaculada-real-hd.jpg",
                imageAlt:
                  "Imagem de Nossa Senhora da Imaculada Conceição no altar de madeira da Matriz",
                imageClass: "object-cover object-center",
                theme: "bg-[#0E2A47] text-[#FAF8F5] border-[#C89B3C]/50",
              },
              {
                title: "Calendário Interativo",
                desc: "Venha acompanhar nosso calendário com os eventos da nossa paróquia.",
                cta: "Abrir Calendário Paroquial",
                href: "/calendario",
                image: "/images/calendario-bispo-padre-crop.jpg",
                imageAlt:
                  "Padre sentado sorrindo recebendo a bênção do Bispo na Paróquia da Imaculada",
                imageClass: "object-cover object-center",
                theme: "bg-[#F3EFE6] text-[#0F2236] border-[#0E2A47]/15",
              },
              {
                title: "Nossa Querida História",
                desc: "Venha conhecer mais sobre nossa história e ver algumas fotos marcantes das épocas.",
                cta: "Explorar Nossa História",
                href: "/historia",
                image: "/images/fachada-imaculada-real-hd.jpg",
                imageAlt:
                  "Fachada da Paróquia da Imaculada com o painel de azulejos da Padroeira",
                imageClass: "object-cover object-center",
                theme: "bg-[#0E2A47] text-[#FAF8F5] border-[#C89B3C]/50",
              },
            ].map((card, idx) => {
              const isDark = card.theme.includes("bg-[#0E2A47]");
              return (
                <div
                  key={card.href}
                  style={{
                    top: `${80 + idx * 22}px`,
                    zIndex: 10 + idx,
                  }}
                  className="gsap-stack-card stack-card"
                >
                  <article
                    style={{
                      backgroundColor: isDark ? "#0E2A47" : "#F3EFE6",
                    }}
                    className={`rounded-3xl border overflow-hidden shadow-[0_24px_60px_rgba(14,42,71,0.18)] grid grid-cols-1 md:grid-cols-12 md:min-h-[22rem] ${card.theme}`}
                  >
                    <div className="md:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between gap-8">
                      <div className="space-y-4">
                        <h3 className="font-display text-2xl sm:text-4xl font-semibold leading-tight">
                          {card.title}
                        </h3>
                        <p
                          className={`text-base sm:text-lg leading-relaxed ${
                            isDark ? "text-[#F1ECE1]/90" : "text-[#334E68]"
                          }`}
                        >
                          {card.desc}
                        </p>
                      </div>

                      <div>
                        <Link
                          href={card.href}
                          className={`inline-flex min-h-12 items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-colors ${
                            isDark
                              ? "bg-[#C89B3C] hover:bg-[#d8ab4c] text-[#0E2A47]"
                              : "bg-[#0E2A47] hover:bg-[#1B4965] text-[#FAF8F5]"
                          }`}
                        >
                          <span>{card.cta}</span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="w-4 h-4"
                          />
                        </Link>
                      </div>
                    </div>

                    <div className="md:col-span-5 relative h-56 sm:h-64 md:h-auto overflow-hidden">
                      <img
                        src={asset(card.image)}
                        alt={card.imageAlt}
                        width={700}
                        height={560}
                        loading="lazy"
                        className={`absolute inset-0 w-full h-full ${card.imageClass}`}
                      />
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =======================================================================
          NOSSO QUERIDO PÁROCO: JAMIL CURY SAWAYA
          (Fundo Renascentista com Anjos Estilo Capela Sistina + Parallax & Reveal no Scroll)
         ======================================================================= */}
      <section
        ref={parocoSectionRef}
        aria-label="Nosso querido pároco"
        className="relative min-h-[88dvh] py-28 sm:py-36 px-4 sm:px-6 bg-[#FAF8F5] overflow-hidden flex items-center justify-center"
      >
        {/* Fundo Ilustrado com Anjos Estilo Capela Sistina */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <img
            ref={parocoBgRef}
            src={asset("/images/paroco-anjos-capela.jpg")}
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
            className="w-full h-full object-cover object-center select-none will-change-transform"
          />
          {/* Suavização nas Bordas Superior e Inferior para Ligação Perfeita */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#F3EFE6] via-[#FAF8F5]/70 to-transparent" />
        </div>

        <div
          className="relative z-10 max-w-xl mx-auto flex flex-col items-center text-center gap-6 will-change-transform"
        >
          <h2
            data-reveal=""
            className="font-display text-2xl sm:text-4xl font-semibold text-[#0E2A47] drop-shadow-[0_2px_12px_rgba(250,248,245,0.95)]"
          >
            Nosso querido pároco
          </h2>

          <div
            data-reveal=""
            data-reveal-delay="120"
            className="w-72 sm:w-80 rounded-3xl overflow-hidden border-2 border-[#C89B3C]/65 shadow-[0_26px_64px_rgba(14,42,71,0.22)] bg-[#0E2A47]"
          >
            <img
              src={asset("/images/paroco-jamil-cury-sawaya.jpg")}
              alt="Nosso querido pároco: Jamil Cury Sawaya"
              width={640}
              height={680}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>

          <p
            data-reveal=""
            data-reveal-delay="220"
            className="font-display text-2xl sm:text-4xl font-semibold text-[#0E2A47] drop-shadow-[0_2px_12px_rgba(250,248,245,0.95)]"
          >
            Jamil Cury Sawaya
          </p>
        </div>
      </section>

      {/* =======================================================================
          ATO V — DOAÇÃO VIA PIX, VISITE A PARÓQUIA E NOSSOS MEIOS DE COMUNICAÇÃO
         ======================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-[#F3EFE6] border-t border-[#0E2A47]/12">
        <div className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 ${parishInfo.pixKey ? "lg:grid-cols-3" : ""} gap-8 items-stretch`}>
          {/* Card 1: Doação via PIX (aparece quando a chave real for cadastrada) */}
          {parishInfo.pixKey && (
          <div
            data-reveal=""
            className="p-7 sm:p-9 rounded-3xl bg-[#0E2A47] text-[#FAF8F5] border border-[#C89B3C]/50 flex flex-col justify-between gap-6 shadow-[0_18px_45px_rgba(14,42,71,0.16)]"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[#F4B942] text-sm font-semibold">
                <Sparkles aria-hidden="true" className="w-4 h-4" />
                <span>Contribuição e Partilha</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#FAF8F5]">
                Doação via PIX
              </h2>
              <p className="text-sm sm:text-base text-[#F1ECE1]/85 leading-relaxed">
                Sua doação ajuda na manutenção da igreja. Caso sinta no seu
                coração, contribua com a nossa comunidade.
              </p>

              <div className="p-4 rounded-2xl bg-[#1B4965]/80 border border-[#C89B3C]/40 space-y-1.5">
                <span className="text-xs text-[#F4B942] font-semibold block">
                  Chave PIX (Copia e Cola)
                </span>
                <p className="font-mono text-xs sm:text-sm text-[#FAF8F5] break-all select-all">
                  {parishInfo.pixKey}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyPix}
              className="min-h-12 w-full px-6 py-3.5 rounded-full bg-[#C89B3C] hover:bg-[#d8ab4c] text-[#0E2A47] font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copiedPix ? (
                <>
                  <Check aria-hidden="true" className="w-5 h-5" />
                  <span>Chave PIX Copiada!</span>
                </>
              ) : (
                <>
                  <Copy aria-hidden="true" className="w-5 h-5" />
                  <span>Copiar Chave PIX</span>
                </>
              )}
            </button>
          </div>
          )}

          {/* Card 2: Visite a Paróquia */}
          <div
            data-reveal=""
            data-reveal-delay="100"
            className="p-7 sm:p-9 rounded-3xl bg-[#FAF8F5] border border-[#0E2A47]/12 flex flex-col justify-between gap-6 shadow-[0_14px_34px_rgba(14,42,71,0.06)]"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[#86601A] text-sm font-semibold">
                <MapPin aria-hidden="true" className="w-4 h-4" />
                <span>Bairro São Bernardo · Campinas - SP</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0E2A47]">
                Visite a Paróquia
              </h2>
              <p className="text-sm sm:text-base text-[#334E68] tabular-nums">
                {parishInfo.address} · CEP {parishInfo.cep}
              </p>

              <div className="rounded-2xl overflow-hidden border border-[#0E2A47]/12 h-44 bg-[#F3EFE6]">
                <iframe
                  title="Localização da Paróquia da Imaculada em Campinas"
                  src="https://www.google.com/maps?q=Pra%C3%A7a+Professor+Paulo+Jos%C3%A9+Otaviano,+2,+S%C3%A3o+Bernardo,+Campinas+-+SP,+13030-629&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 w-full px-5 py-2.5 rounded-full bg-[#0E2A47] hover:bg-[#1B4965] text-[#FAF8F5] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <span>Abrir Rota no Maps</span>
              <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
            </a>
          </div>

          {/* Card 3: Nossos Meios de Comunicação */}
          <div
            data-reveal=""
            data-reveal-delay="200"
            className={`${parishInfo.pixKey ? "md:col-span-2 lg:col-span-1" : ""} p-7 sm:p-9 rounded-3xl bg-[#FAF8F5] border border-[#0E2A47]/12 flex flex-col justify-between gap-6 shadow-[0_14px_34px_rgba(14,42,71,0.06)]`}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[#86601A] text-sm font-semibold">
                <Phone aria-hidden="true" className="w-4 h-4" />
                <span>Canais de Atendimento</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0E2A47]">
                Nossos Meios de Comunicação
              </h2>

              {/* 5 Retângulos com Bordas Arredondadas (Telefone, WhatsApp, Instagram, YouTube, Facebook) */}
              <div className="space-y-2.5 pt-1">
                {/* 1. Telefone Fixo */}
                <a
                  href={`tel:${(parishInfo.phone ?? "").replace(/\D/g, "")}`}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#F3EFE6] hover:bg-[#eae3d5] border border-[#0E2A47]/10 flex items-center justify-between text-[#0E2A47] transition-all group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#0E2A47] text-[#FAF8F5] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] uppercase tracking-wider text-[#334E68] font-semibold block truncate">
                        Telefone Fixo
                      </span>
                      <span className="font-semibold text-sm sm:text-base tabular-nums text-[#0E2A47] block truncate">
                        {parishInfo.phone}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#334E68] group-hover:text-[#0E2A47] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                </a>

                {/* 2. WhatsApp Oficial */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#F3EFE6] hover:bg-[#eae3d5] border border-[#0E2A47]/10 flex items-center justify-between text-[#0E2A47] transition-all group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageCircle className="w-4 h-4 fill-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] uppercase tracking-wider text-[#334E68] font-semibold block truncate">
                        WhatsApp Oficial
                      </span>
                      <span className="font-semibold text-sm sm:text-base tabular-nums text-[#0E2A47] block truncate">
                        {parishInfo.whatsapp}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#334E68] group-hover:text-[#0E2A47] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                </a>

                {/* 3. Instagram Oficial */}
                <a
                  href={parishInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#F3EFE6] hover:bg-[#eae3d5] border border-[#0E2A47]/10 flex items-center justify-between text-[#0E2A47] transition-all group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] uppercase tracking-wider text-[#334E68] font-semibold block truncate">
                        Instagram
                      </span>
                      <span className="font-semibold text-sm sm:text-base text-[#0E2A47] block truncate">
                        @paroquiadaimaculadacampinas
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#334E68] group-hover:text-[#0E2A47] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                </a>

                {/* 4. YouTube Oficial */}
                <a
                  href={parishInfo.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#F3EFE6] hover:bg-[#eae3d5] border border-[#0E2A47]/10 flex items-center justify-between text-[#0E2A47] transition-all group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                        <polygon
                          points="10 15 15 12 10 9 10 15"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] uppercase tracking-wider text-[#334E68] font-semibold block truncate">
                        YouTube
                      </span>
                      <span className="font-semibold text-sm sm:text-base text-[#0E2A47] block truncate">
                        @ParóquiadaImaculada
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#334E68] group-hover:text-[#0E2A47] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                </a>

                {/* 5. Facebook Oficial */}
                <a
                  href={parishInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#F3EFE6] hover:bg-[#eae3d5] border border-[#0E2A47]/10 flex items-center justify-between text-[#0E2A47] transition-all group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] uppercase tracking-wider text-[#334E68] font-semibold block truncate">
                        Facebook
                      </span>
                      <span className="font-semibold text-sm sm:text-base text-[#0E2A47] block truncate">
                        Paróquia da Imaculada
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#334E68] group-hover:text-[#0E2A47] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
