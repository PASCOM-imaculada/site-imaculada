"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { useParish } from "@/context/ParishContext";
import { PastoralRegistration } from "@/types/parish";

export default function PastoraisPage() {
  const { data, addPastoralRegistration } = useParish();
  const { pastorals, parishInfo } = data;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pastoralName, setPastoralName] = useState(
    pastorals[0]?.name || "Pastoral da Caridade"
  );
  const [availability, setAvailability] = useState("Finais de semana");
  const [submittedReg, setSubmittedReg] =
    useState<PastoralRegistration | null>(null);

  function handleSelectForSignup(name: string) {
    setPastoralName(name);
    const formEl = document.getElementById("inscricao-pastoral");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    const reg = await addPastoralRegistration({
      fullName: fullName.trim(),
      phone: phone.trim(),
      pastoralName,
      availability,
      message: "",
    });

    setSubmittedReg(reg);
    setFullName("");
    setPhone("");
  }

  return (
    <div className="bg-[#FAF8F5] text-[#0F2236] py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-20">
        <header className="space-y-3">
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0E2A47]">
            Pastorais e Movimentos
          </h1>
          <p className="text-base sm:text-lg text-[#334E68]">
            Conheça as frentes de evangelização e serviço da Paróquia da
            Imaculada e inscreva-se ao final da página.
          </p>
        </header>

        {/* Lista Minimalista das Pastorais */}
        <section aria-label="Lista de pastorais" className="divide-y divide-[#0E2A47]/12 border-y border-[#0E2A47]/12">
          {pastorals.map((pastoral) => (
            <article
              key={pastoral.id}
              className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#0E2A47]">
                    {pastoral.name}
                  </h2>
                  <span className="text-xs text-[#9A701E] font-medium">
                    {pastoral.type}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#334E68]">
                  {pastoral.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSelectForSignup(pastoral.name)}
                className="text-sm font-semibold text-[#0E2A47] hover:text-[#9A701E] shrink-0 cursor-pointer transition-colors self-start sm:self-center py-1"
              >
                Participar →
              </button>
            </article>
          ))}
        </section>

        {/* Formulário Minimalista de Inscrição */}
        <section
          id="inscricao-pastoral"
          className="pt-4 max-w-xl space-y-6"
        >
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0E2A47]">
              Quero Participar
            </h2>
            <p className="text-sm sm:text-base text-[#334E68]">
              Deixe seu contato para a coordenação da pastoral acolher você.
            </p>
          </div>

          {submittedReg && (
            <div
              role="status"
              aria-live="polite"
              className="p-5 rounded-xl bg-[#F3EFE6] border border-[#0E2A47]/15 space-y-3"
            >
              <p className="text-sm font-semibold text-[#0E2A47] flex items-center gap-2">
                <Check aria-hidden="true" className="w-4 h-4 text-[#1F6F50]" />
                <span>
                  Inscrição registrada para {submittedReg.pastoralName}.
                </span>
              </p>
              <a
                href={`https://wa.me/${
                  parishInfo.whatsappNumber
                }?text=${encodeURIComponent(
                  `Olá! Paz e Bem. Meu nome é ${submittedReg.fullName} e gostaria de participar da ${submittedReg.pastoralName}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E2A47] underline"
              >
                <span>Confirmar também pelo WhatsApp</span>
                <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="reg-pastoral"
                className="block text-xs font-semibold text-[#0E2A47] mb-1.5"
              >
                Pastoral ou Movimento
              </label>
              <select
                id="reg-pastoral"
                value={pastoralName}
                onChange={(e) => setPastoralName(e.target.value)}
                className="w-full min-h-11 px-4 py-2.5 rounded-lg bg-[#F3EFE6] border border-[#0E2A47]/15 text-sm font-medium text-[#0F2236]"
              >
                {pastorals.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-semibold text-[#0E2A47] mb-1.5"
                >
                  Seu nome
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full min-h-11 px-4 py-2.5 rounded-lg bg-[#F3EFE6] border border-[#0E2A47]/15 text-sm text-[#0F2236]"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  className="block text-xs font-semibold text-[#0E2A47] mb-1.5"
                >
                  WhatsApp
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(19) 99999-9999"
                  className="w-full min-h-11 px-4 py-2.5 rounded-lg bg-[#F3EFE6] border border-[#0E2A47]/15 text-sm text-[#0F2236] tabular-nums"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-avail"
                className="block text-xs font-semibold text-[#0E2A47] mb-1.5"
              >
                Disponibilidade
              </label>
              <select
                id="reg-avail"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full min-h-11 px-4 py-2.5 rounded-lg bg-[#F3EFE6] border border-[#0E2A47]/15 text-sm text-[#0F2236]"
              >
                <option value="Finais de semana">Finais de semana</option>
                <option value="Durante a semana à noite">
                  Durante a semana à noite
                </option>
                <option value="Durante a semana (manhã/tarde)">
                  Durante a semana (manhã/tarde)
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="min-h-11 px-6 py-2.5 rounded-full bg-[#0E2A47] hover:bg-[#1B4965] text-[#FAF8F5] text-sm font-semibold cursor-pointer transition-colors"
            >
              Enviar Inscrição
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
