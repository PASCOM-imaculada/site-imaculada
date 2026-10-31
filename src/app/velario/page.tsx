"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { useParish } from "@/context/ParishContext";
import { VirtualCandle } from "@/types/parish";

const CATEGORIES: VirtualCandle["category"][] = [
  "Ação de Graças",
  "Saúde e Enfermos",
  "Família e Juventude",
  "Intenção Especial",
];

export default function VelarioPage() {
  const { data, addCandle } = useParish();
  const { candles } = data;

  const [name, setName] = useState("");
  const [category, setCategory] =
    useState<VirtualCandle["category"]>("Ação de Graças");
  const [intention, setIntention] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [justLit, setJustLit] = useState(false);

  const visibleCandles = candles.filter((c) => c.isPublic);

  async function handleLightCandle(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !intention.trim()) return;

    await addCandle({
      name: name.trim(),
      category,
      intention: intention.trim(),
      isPublic,
    });

    setName("");
    setIntention("");
    setJustLit(true);
    setTimeout(() => setJustLit(false), 4000);
  }

  return (
    <div className="bg-[#0E2A47] text-[#FAF8F5] min-h-[calc(100dvh-3.5rem)] py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-20">
        {/* Cabeçalho Contemplativo */}
        <header className="text-center space-y-4 max-w-xl mx-auto">
          <div
            aria-hidden="true"
            className="mx-auto w-5 h-9 rounded-full bg-gradient-to-t from-[#C89B3C] via-[#F4B942] to-[#FAF8F5] shadow-[0_0_24px_#F4B942] animate-candle-flame mb-6"
          />
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#FAF8F5]">
            Capela das Velas
          </h1>
          <p className="text-base sm:text-lg text-[#F1ECE1]/80">
            Acenda uma vela virtual e entregue sua intenção a Nossa Senhora da
            Imaculada Conceição.
          </p>
        </header>

        {/* Grade Minimalista de Velas Acesas */}
        <section aria-label="Altar de velas acesas" className="space-y-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 py-8 px-4 rounded-2xl bg-[#1B4965]/35 border border-[#C89B3C]/25">
            {candles.slice(0, 12).map((candle) => (
              <div
                key={candle.id}
                className="flex flex-col items-center text-center gap-2"
              >
                <div aria-hidden="true" className="flex flex-col items-center">
                  <div className="w-3 h-5 rounded-full bg-gradient-to-t from-[#C89B3C] via-[#F4B942] to-[#FAF8F5] shadow-[0_0_14px_#F4B942] animate-candle-flame" />
                  <div className="w-4 h-9 bg-[#FAF8F5] rounded-t-xs mt-0.5" />
                </div>
                <span className="text-xs text-[#F1ECE1]/85 truncate max-w-full">
                  {candle.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Formulário Limpo para Acender Vela */}
        <section className="max-w-xl mx-auto space-y-6">
          <h2 className="font-display text-2xl font-semibold text-center text-[#FAF8F5]">
            Acender uma Vela
          </h2>

          {justLit && (
            <div
              role="status"
              aria-live="polite"
              className="p-4 rounded-xl bg-[#1B4965] border border-[#C89B3C] text-center text-sm font-semibold text-[#F4B942] flex items-center justify-center gap-2"
            >
              <Check aria-hidden="true" className="w-4 h-4" />
              <span>Sua vela foi acesa na Capela Virtual.</span>
            </div>
          )}

          <form onSubmit={handleLightCandle} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="candle-name"
                  className="block text-xs text-[#F1ECE1]/80 mb-1.5"
                >
                  Seu nome
                </label>
                <input
                  id="candle-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Maria Aparecida"
                  className="w-full min-h-11 px-4 py-2.5 rounded-lg bg-[#1B4965]/60 border border-[#FAF8F5]/20 text-[#FAF8F5] placeholder:text-[#F1ECE1]/45 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="candle-cat"
                  className="block text-xs text-[#F1ECE1]/80 mb-1.5"
                >
                  Intenção
                </label>
                <select
                  id="candle-cat"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as VirtualCandle["category"])
                  }
                  className="w-full min-h-11 px-4 py-2.5 rounded-lg bg-[#1B4965]/60 border border-[#FAF8F5]/20 text-[#FAF8F5] text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0E2A47]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="candle-text"
                className="block text-xs text-[#F1ECE1]/80 mb-1.5"
              >
                Sua oração
              </label>
              <textarea
                id="candle-text"
                rows={3}
                required
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Escreva seu pedido ou agradecimento..."
                className="w-full px-4 py-2.5 rounded-lg bg-[#1B4965]/60 border border-[#FAF8F5]/20 text-[#FAF8F5] placeholder:text-[#F1ECE1]/45 text-sm"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                id="candle-public"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 accent-[#C89B3C]"
              />
              <label
                htmlFor="candle-public"
                className="text-xs text-[#F1ECE1]/80 cursor-pointer"
              >
                Mostrar minha oração no mural abaixo
              </label>
            </div>

            <button
              type="submit"
              className="min-h-12 w-full rounded-full bg-[#C89B3C] hover:bg-[#d8ab4c] text-[#0E2A47] font-semibold text-sm cursor-pointer transition-colors"
            >
              Acender Vela
            </button>
          </form>
        </section>

        {/* Mural Limpo de Orações */}
        <section className="space-y-6 pt-8 border-t border-[#FAF8F5]/12">
          <h2 className="font-display text-xl font-semibold text-[#FAF8F5]">
            Intenções dos Fiéis
          </h2>

          <div className="divide-y divide-[#FAF8F5]/10">
            {visibleCandles.map((candle) => (
              <article key={candle.id} className="py-5 space-y-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-base text-[#FAF8F5]">
                    {candle.name}
                  </h3>
                  <span className="text-xs text-[#F4B942]">
                    {candle.category}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#F1ECE1]/85">
                  “{candle.intention}”
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
