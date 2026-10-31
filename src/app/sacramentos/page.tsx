"use client";

import React, { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useParish } from "@/context/ParishContext";

interface SacramentGuide {
  id: string;
  title: string;
  subtitle: string;
  preparation: string[];
  documents: string[];
  whatsappMessage: string;
}

const SACRAMENTS_DATA: SacramentGuide[] = [
  {
    id: "batismo",
    title: "Batismo",
    subtitle: "Iniciação na vida cristã para crianças e adultos",
    preparation: [
      "Inscrição prévia na Secretaria Paroquial ou pelo WhatsApp.",
      "Participação dos pais e padrinhos no encontro de preparação.",
      "Para maiores de 7 anos ou adultos, a preparação ocorre via Catequese.",
    ],
    documents: [
      "Certidão de Nascimento da criança.",
      "Comprovante de endereço dos pais.",
      "Documento dos padrinhos (católicos, crismados, maiores de 16 anos).",
    ],
    whatsappMessage:
      "Olá! Paz e Bem. Gostaria de informações sobre datas e inscrição para o Batismo na Paróquia da Imaculada.",
  },
  {
    id: "eucaristia",
    title: "Primeira Eucaristia (Catequese)",
    subtitle: "Encontros semanais para crianças, adolescentes e adultos",
    preparation: [
      "Encontros semanais na Igreja Matriz.",
      "Participação nas Missas dominicais com a família.",
    ],
    documents: [
      "Certidão de Nascimento ou RG.",
      "Lembrança ou Certidão de Batismo (se já batizado).",
      "Comprovante de residência.",
    ],
    whatsappMessage:
      "Olá! Paz e Bem. Gostaria de informações sobre inscrição na Catequese na Paróquia da Imaculada.",
  },
  {
    id: "crisma",
    title: "Crisma",
    subtitle: "Confirmação na fé para jovens e adultos",
    preparation: [
      "Encontros semanais com a Pastoral da Crisma.",
      "Escolha de padrinho ou madrinha católico(a) e já crismado(a).",
    ],
    documents: [
      "Certidão de Batismo e comprovante de Primeira Eucaristia.",
      "RG do crismando.",
    ],
    whatsappMessage:
      "Olá! Paz e Bem. Gostaria de informações sobre as turmas de Crisma na Paróquia da Imaculada.",
  },
  {
    id: "confissao",
    title: "Confissão",
    subtitle: "Atendimento individual de Reconciliação",
    preparation: [
      "Na nossa paróquia, as confissões são agendadas diretamente com a Secretaria.",
    ],
    documents: ["Basta agendar o horário pelo WhatsApp ou presencialmente."],
    whatsappMessage:
      "Olá, tudo bem? Gostaria de marcar um horário para me confessar.",
  },
  {
    id: "matrimonio",
    title: "Matrimônio",
    subtitle: "Celebração religiosa e preparação de noivos",
    preparation: [
      "Reservar a data na Secretaria com 6 a 12 meses de antecedência.",
      "Curso de Noivos com a Pastoral Familiar e Processo Matrimonial.",
    ],
    documents: [
      "Certidão de Batismo atualizada dos noivos (emitida há menos de 6 meses).",
      "RG, CPF, comprovante de residência e protocolo do casamento civil.",
    ],
    whatsappMessage:
      "Olá! Paz e Bem. Gostaria de informações sobre datas e documentos para Matrimônio na Paróquia da Imaculada.",
  },
  {
    id: "uncao",
    title: "Unção dos Enfermos",
    subtitle: "Visita do sacerdote ou ministros aos doentes e idosos",
    preparation: [
      "Solicitar a visita informando o nome do enfermo e endereço completo à Secretaria.",
    ],
    documents: ["Contato de um familiar responsável para acolher a visita."],
    whatsappMessage:
      "Olá! Paz e Bem. Gostaria de solicitar uma visita aos enfermos pela Paróquia da Imaculada.",
  },
];

export default function SacramentosPage() {
  const { data } = useParish();
  const { parishInfo } = data;
  const [openId, setOpenId] = useState<string>("batismo");

  return (
    <div className="bg-[#FAF8F5] text-[#0F2236] py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-14">
        <header className="space-y-3">
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0E2A47]">
            Sacramentos
          </h1>
          <p className="text-base sm:text-lg text-[#334E68]">
            Selecione um sacramento para consultar a preparação, os documentos
            necessários e falar com a secretaria.
          </p>
        </header>

        <div className="divide-y divide-[#0E2A47]/12 border-y border-[#0E2A47]/12">
          {SACRAMENTS_DATA.map((sac) => {
            const isExpanded = openId === sac.id;
            const whatsappLink = `https://wa.me/${
              parishInfo.whatsappNumber
            }?text=${encodeURIComponent(sac.whatsappMessage)}`;

            return (
              <article key={sac.id} className="py-6">
                <button
                  type="button"
                  onClick={() => setOpenId(isExpanded ? "" : sac.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left flex items-center justify-between gap-4 py-2 cursor-pointer"
                >
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-[#0E2A47]">
                      {sac.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#334E68] mt-0.5">
                      {sac.subtitle}
                    </p>
                  </div>
                  <ChevronDown
                    aria-hidden="true"
                    className={`w-5 h-5 text-[#0E2A47] shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="pt-6 pb-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-2.5">
                        <h3 className="text-sm font-semibold text-[#0E2A47]">
                          Preparação
                        </h3>
                        <ul className="space-y-2 text-base text-[#334E68]">
                          {sac.preparation.map((step) => (
                            <li key={step}>• {step}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2.5">
                        <h3 className="text-sm font-semibold text-[#0E2A47]">
                          Documentos
                        </h3>
                        <ul className="space-y-2 text-base text-[#334E68]">
                          {sac.documents.map((doc) => (
                            <li key={doc}>• {doc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 px-5 py-2.5 rounded-full bg-[#0E2A47] hover:bg-[#1B4965] text-[#FAF8F5] text-sm font-semibold transition-colors"
                      >
                        <span>Agendar ou tirar dúvidas no WhatsApp</span>
                        <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
