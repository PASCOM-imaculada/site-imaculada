"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useParish } from "@/context/ParishContext";
import { asset } from "@/lib/asset";

export default function HistoriaPage() {
  const { data } = useParish();
  const { historyChapters, parishInfo } = data;

  const whatsappHistoryUrl = `https://wa.me/${parishInfo.whatsappNumber}?text=${encodeURIComponent(
    "Olá! Paz e Bem. Gostaria de compartilhar fotos antigas ou relatos históricos para o acervo da Paróquia da Imaculada."
  )}`;

  return (
    <div className="bg-[#FAF8F5] text-[#0F2236] py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-20">
        <header className="space-y-4">
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0E2A47]">
            Nossa História
          </h1>
          <p className="text-base sm:text-lg text-[#334E68] leading-relaxed">
            Memória viva da Paróquia da Imaculada no bairro São Bernardo, em
            Campinas.
          </p>
        </header>

        {/* Linha do Tempo Minimalista */}
        <ol className="divide-y divide-[#0E2A47]/12 border-y border-[#0E2A47]/12">
          {historyChapters.map((chapter) => (
            <li key={chapter.id} className="py-10 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-2xl font-semibold text-[#0E2A47]">
                  {chapter.title}
                </h2>
                <span className="text-xs font-medium text-[#9A701E]">
                  {chapter.period}
                </span>
              </div>

              <p className="text-base text-[#0F2236] leading-relaxed">
                {chapter.summary}
              </p>

              {chapter.imageUrl ? (
                <figure className="pt-2 space-y-2">
                  <img
                    src={asset(chapter.imageUrl)}
                    alt={chapter.title}
                    className="w-full max-h-96 object-cover rounded-xl"
                  />
                  <figcaption className="text-xs text-[#334E68]">
                    {chapter.note}
                  </figcaption>
                </figure>
              ) : (
                <p className="text-xs text-[#334E68]/80 pt-1">{chapter.note}</p>
              )}
            </li>
          ))}
        </ol>

        {/* Convite Simples para Contribuição de Fotos Antigas */}
        <footer className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-[#0E2A47]">
            Contribua com o Acervo Fotográfico
          </h2>
          <p className="text-sm sm:text-base text-[#334E68]">
            Possui fotos históricas da construção da Matriz, primeiras comunhões
            ou festas antigas? Envie para a nossa secretaria.
          </p>
          <div className="pt-1">
            <a
              href={whatsappHistoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E2A47] hover:text-[#9A701E] transition-colors"
            >
              <span>Enviar fotos pelo WhatsApp</span>
              <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
