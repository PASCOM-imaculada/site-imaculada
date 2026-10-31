"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  HeartHandshake,
  History,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useParish } from "@/context/ParishContext";
import { ParishEvent } from "@/types/parish";

type AdminTab =
  | "eventos"
  | "horarios-pix"
  | "pastorais-inscricoes"
  | "historia-velario";

export default function AdminPage() {
  const {
    data,
    addEvent,
    deleteEvent,
    updateParishInfo,
    updateMassSchedule,
    addPastoral,
    deletePastoral,
    addHistoryChapter,
    deleteHistoryChapter,
  } = useParish();

  const [activeTab, setActiveTab] = useState<AdminTab>("eventos");
  const [feedbackBanner, setFeedbackBanner] = useState<string>("");

  // Estado Novo Evento do Calendário
  const [evtTitle, setEvtTitle] = useState("");
  const [evtDate, setEvtDate] = useState("2026-11-15");
  const [evtTime, setEvtTime] = useState("19h00");
  const [evtCategory, setEvtCategory] =
    useState<ParishEvent["category"]>("Liturgia");
  const [evtLocation, setEvtLocation] = useState("Igreja Matriz");
  const [evtDescription, setEvtDescription] = useState("");

  // Estado Horários e PIX
  const [pixKey, setPixKey] = useState(data.parishInfo.pixKey);
  const [pixHolder, setPixHolder] = useState(data.parishInfo.pixHolder);
  const [weekdaysOpen, setWeekdaysOpen] = useState(
    data.parishInfo.churchOpenHours.weekdays
  );
  const [saturdayOpen, setSaturdayOpen] = useState(
    data.parishInfo.churchOpenHours.saturday
  );

  // Estado Nova Pastoral
  const [pastName, setPastName] = useState("");
  const [pastType, setPastType] = useState("Pastoral");
  const [pastSchedule, setPastSchedule] = useState("");
  const [pastCoordinator, setPastCoordinator] = useState("");
  const [pastDescription, setPastDescription] = useState("");

  // Estado Novo Capítulo da História
  const [histTitle, setHistTitle] = useState("");
  const [histPeriod, setHistPeriod] = useState("");
  const [histEra, setHistEra] = useState("");
  const [histSummary, setHistSummary] = useState("");
  const [histNote, setHistNote] = useState("");
  const [histImageUrl, setHistImageUrl] = useState("");

  function notify(msg: string) {
    setFeedbackBanner(msg);
    setTimeout(() => setFeedbackBanner(""), 4000);
  }

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!evtTitle.trim() || !evtDate) return;
    await addEvent({
      title: evtTitle.trim(),
      date: evtDate,
      time: evtTime.trim() || "19h00",
      category: evtCategory,
      location: evtLocation.trim() || "Igreja Matriz",
      description: evtDescription.trim(),
    });
    setEvtTitle("");
    setEvtDescription("");
    notify("Evento adicionado ao Calendário Interativo com sucesso!");
  }

  async function handleSaveParishInfo(e: React.FormEvent) {
    e.preventDefault();
    await updateParishInfo({
      pixKey: pixKey.trim(),
      pixHolder: pixHolder.trim(),
      churchOpenHours: {
        ...data.parishInfo.churchOpenHours,
        weekdays: weekdaysOpen.trim(),
        saturday: saturdayOpen.trim(),
      },
    });
    notify("Horários da Secretaria e Chave PIX atualizados com sucesso!");
  }

  async function handleAddPastoral(e: React.FormEvent) {
    e.preventDefault();
    if (!pastName.trim()) return;
    await addPastoral({
      name: pastName.trim(),
      type: pastType.trim() || "Pastoral",
      schedule: pastSchedule.trim() || "Consultar Secretaria",
      coordinator: pastCoordinator.trim() || "Coordenação Paroquial",
      description: pastDescription.trim(),
    });
    setPastName("");
    setPastSchedule("");
    setPastCoordinator("");
    setPastDescription("");
    notify("Nova Pastoral/Movimento cadastrada com sucesso!");
  }

  async function handleAddHistory(e: React.FormEvent) {
    e.preventDefault();
    if (!histTitle.trim() || !histSummary.trim()) return;
    await addHistoryChapter({
      title: histTitle.trim(),
      period: histPeriod.trim() || "Memória Paroquial",
      era: histEra.trim() || "Acervo Histórico",
      summary: histSummary.trim(),
      note: histNote.trim() || "Fotografia/relato do acervo paroquial.",
      imageUrl: histImageUrl.trim() || undefined,
    });
    setHistTitle("");
    setHistPeriod("");
    setHistEra("");
    setHistSummary("");
    setHistNote("");
    setHistImageUrl("");
    notify("Novo capítulo histórico adicionado à página de História!");
  }

  return (
    <div className="bg-[#FAF8F5] text-[#0F2236]">
      {/* Cabeçalho do Painel Administrativo da Secretaria */}
      <section className="bg-[#0E2A47] text-[#FAF8F5] py-10 lg:py-12 border-b-2 border-[#C89B3C]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#FAF8F5]">
            Painel da Secretaria e Pascom — Paróquia da Imaculada
          </h1>
          <p className="text-base sm:text-lg text-[#F1ECE1]">
            Adicione ou remova eventos do calendário interativo, atualize
            horários, gerencie a chave PIX, acompanhe inscrições nas pastorais e
            publique fotos e relatos históricos sem precisar mexer em código.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {feedbackBanner && (
            <div
              role="status"
              aria-live="polite"
              className="p-4 rounded-xl bg-[#1F6F50] text-[#FAF8F5] font-bold text-base flex items-center gap-2.5 shadow-md"
            >
              <CheckCircle2 aria-hidden="true" className="w-5 h-5 shrink-0" />
              <span>{feedbackBanner}</span>
            </div>
          )}

          {/* Abas de Operação da Secretaria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("eventos")}
              className={`min-h-14 p-4 rounded-xl font-bold text-base flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "eventos"
                  ? "bg-[#0E2A47] text-[#FAF8F5] border-2 border-[#C89B3C]"
                  : "bg-[#F1ECE1] text-[#0E2A47] border border-[#D8CEBE]"
              }`}
            >
              <Calendar
                aria-hidden="true"
                className="w-5 h-5 text-[#C89B3C] shrink-0"
              />
              <span>1. Calendário de Eventos ({data.events.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("horarios-pix")}
              className={`min-h-14 p-4 rounded-xl font-bold text-base flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "horarios-pix"
                  ? "bg-[#0E2A47] text-[#FAF8F5] border-2 border-[#C89B3C]"
                  : "bg-[#F1ECE1] text-[#0E2A47] border border-[#D8CEBE]"
              }`}
            >
              <Clock
                aria-hidden="true"
                className="w-5 h-5 text-[#C89B3C] shrink-0"
              />
              <span>2. Horários, Missas e PIX</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("pastorais-inscricoes")}
              className={`min-h-14 p-4 rounded-xl font-bold text-base flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "pastorais-inscricoes"
                  ? "bg-[#0E2A47] text-[#FAF8F5] border-2 border-[#C89B3C]"
                  : "bg-[#F1ECE1] text-[#0E2A47] border border-[#D8CEBE]"
              }`}
            >
              <HeartHandshake
                aria-hidden="true"
                className="w-5 h-5 text-[#C89B3C] shrink-0"
              />
              <span>
                3. Pastorais e Inscrições ({data.pastoralRegistrations.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("historia-velario")}
              className={`min-h-14 p-4 rounded-xl font-bold text-base flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "historia-velario"
                  ? "bg-[#0E2A47] text-[#FAF8F5] border-2 border-[#C89B3C]"
                  : "bg-[#F1ECE1] text-[#0E2A47] border border-[#D8CEBE]"
              }`}
            >
              <History
                aria-hidden="true"
                className="w-5 h-5 text-[#C89B3C] shrink-0"
              />
              <span>4. Acervo Histórico e Velário</span>
            </button>
          </div>

          {/* ABA 1: GERENCIAR CALENDÁRIO DE EVENTOS */}
          {activeTab === "eventos" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <form
                onSubmit={handleAddEvent}
                className="lg:col-span-5 bg-[#F1ECE1] border border-[#D8CEBE] rounded-2xl p-6 space-y-4"
              >
                <h2 className="font-display text-2xl font-bold text-[#0E2A47]">
                  Adicionar Novo Evento ao Calendário
                </h2>

                <div>
                  <label
                    htmlFor="evt-title"
                    className="block font-bold text-sm text-[#0E2A47] mb-1"
                  >
                    Título do Evento / Celebração *
                  </label>
                  <input
                    id="evt-title"
                    type="text"
                    required
                    value={evtTitle}
                    onChange={(e) => setEvtTitle(e.target.value)}
                    placeholder="Ex.: Quermesse da Padroeira / Missa Solene"
                    className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="evt-date"
                      className="block font-bold text-sm text-[#0E2A47] mb-1"
                    >
                      Data *
                    </label>
                    <input
                      id="evt-date"
                      type="date"
                      required
                      value={evtDate}
                      onChange={(e) => setEvtDate(e.target.value)}
                      className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE] tabular-nums"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="evt-time"
                      className="block font-bold text-sm text-[#0E2A47] mb-1"
                    >
                      Horário *
                    </label>
                    <input
                      id="evt-time"
                      type="text"
                      required
                      value={evtTime}
                      onChange={(e) => setEvtTime(e.target.value)}
                      placeholder="Ex.: 19h30"
                      className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE] tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="evt-cat"
                      className="block font-bold text-sm text-[#0E2A47] mb-1"
                    >
                      Categoria
                    </label>
                    <select
                      id="evt-cat"
                      value={evtCategory}
                      onChange={(e) =>
                        setEvtCategory(
                          e.target.value as ParishEvent["category"]
                        )
                      }
                      className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE] font-semibold"
                    >
                      <option value="Liturgia">Liturgia</option>
                      <option value="Festa da Padroeira">
                        Festa da Padroeira
                      </option>
                      <option value="Pastoral">Pastoral</option>
                      <option value="Movimento">Movimento</option>
                      <option value="Comunidade">Comunidade</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="evt-loc"
                      className="block font-bold text-sm text-[#0E2A47] mb-1"
                    >
                      Local
                    </label>
                    <input
                      id="evt-loc"
                      type="text"
                      value={evtLocation}
                      onChange={(e) => setEvtLocation(e.target.value)}
                      className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="evt-desc"
                    className="block font-bold text-sm text-[#0E2A47] mb-1"
                  >
                    Descrição curta para os fiéis
                  </label>
                  <textarea
                    id="evt-desc"
                    rows={3}
                    value={evtDescription}
                    onChange={(e) => setEvtDescription(e.target.value)}
                    placeholder="Detalhes importantes do evento..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-13 w-full px-5 py-3 rounded-xl bg-[#0E2A47] hover:bg-[#1B4965] text-[#FAF8F5] font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus aria-hidden="true" className="w-5 h-5 text-[#F4B942]" />
                  <span>Publicar Evento no Calendário</span>
                </button>
              </form>

              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-display text-2xl font-bold text-[#0E2A47]">
                  Eventos Cadastrados Atualmente ({data.events.length})
                </h2>

                {data.events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 rounded-2xl bg-[#F1ECE1] border border-[#D8CEBE] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0E2A47] text-[#F4B942] tabular-nums">
                        {evt.date} · {evt.time} · {evt.category}
                      </span>
                      <h3 className="font-display text-xl font-bold text-[#0E2A47]">
                        {evt.title}
                      </h3>
                      <p className="text-sm text-[#334E68]">{evt.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        deleteEvent(evt.id);
                        notify("Evento removido do calendário.");
                      }}
                      className="min-h-11 px-4 py-2 rounded-xl bg-[#9E2A2B] hover:bg-[#7d2021] text-[#FAF8F5] font-bold text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      <Trash2 aria-hidden="true" className="w-4 h-4" />
                      <span>Remover</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 2: HORÁRIOS DE MISSA, SECRETARIA E CHAVE PIX */}
          {activeTab === "horarios-pix" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <form
                onSubmit={handleSaveParishInfo}
                className="lg:col-span-6 bg-[#F1ECE1] border border-[#D8CEBE] rounded-2xl p-6 space-y-4"
              >
                <h2 className="font-display text-2xl font-bold text-[#0E2A47]">
                  Horário da Secretaria / Igreja Aberta e PIX
                </h2>

                <div>
                  <label
                    htmlFor="admin-weekdays"
                    className="block font-bold text-sm text-[#0E2A47] mb-1"
                  >
                    Horário de Segunda a Sexta-feira
                  </label>
                  <input
                    id="admin-weekdays"
                    type="text"
                    value={weekdaysOpen}
                    onChange={(e) => setWeekdaysOpen(e.target.value)}
                    className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-saturday"
                    className="block font-bold text-sm text-[#0E2A47] mb-1"
                  >
                    Horário aos Sábados
                  </label>
                  <input
                    id="admin-saturday"
                    type="text"
                    value={saturdayOpen}
                    onChange={(e) => setSaturdayOpen(e.target.value)}
                    className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-pix-key"
                    className="block font-bold text-sm text-[#0E2A47] mb-1"
                  >
                    Chave PIX Oficial (Dízimo e Doações)
                  </label>
                  <input
                    id="admin-pix-key"
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE] font-mono"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-pix-holder"
                    className="block font-bold text-sm text-[#0E2A47] mb-1"
                  >
                    Nome do Favorecido PIX
                  </label>
                  <input
                    id="admin-pix-holder"
                    type="text"
                    value={pixHolder}
                    onChange={(e) => setPixHolder(e.target.value)}
                    className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-13 w-full px-5 py-3 rounded-xl bg-[#0E2A47] hover:bg-[#1B4965] text-[#FAF8F5] font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save aria-hidden="true" className="w-5 h-5 text-[#F4B942]" />
                  <span>Salvar Horários e Chave PIX</span>
                </button>
              </form>

              <div className="lg:col-span-6 bg-[#F1ECE1] border border-[#D8CEBE] rounded-2xl p-6 space-y-4">
                <h2 className="font-display text-2xl font-bold text-[#0E2A47]">
                  Editar Horários de Missas Fixas
                </h2>
                <p className="text-sm text-[#334E68]">
                  Separe os horários por vírgula (ex.: 08h30, 10h30, 18h30) para
                  atualizar imediatamente na Página Inicial.
                </p>

                <div className="space-y-4">
                  {data.massSchedules.map((sched) => (
                    <div
                      key={sched.id}
                      className="p-4 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE] space-y-2"
                    >
                      <label
                        htmlFor={`mass-${sched.id}`}
                        className="block font-display font-bold text-lg text-[#0E2A47]"
                      >
                        {sched.day}
                      </label>
                      <input
                        id={`mass-${sched.id}`}
                        type="text"
                        defaultValue={sched.times.join(", ")}
                        onBlur={(e) => {
                          const times = e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean);
                          updateMassSchedule({ ...sched, times });
                          notify(`Horários de ${sched.day} atualizados!`);
                        }}
                        className="w-full min-h-11 px-3.5 py-2 rounded-lg bg-[#F1ECE1] border border-[#D8CEBE] font-bold text-[#0E2A47] tabular-nums"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: PASTORAIS E INSCRIÇÕES RECEBIDAS */}
          {activeTab === "pastorais-inscricoes" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-[#F1ECE1] border border-[#D8CEBE] rounded-2xl p-6 space-y-4">
                  <h2 className="font-display text-2xl font-bold text-[#0E2A47]">
                    Inscrições Recebidas pelo Site (
                    {data.pastoralRegistrations.length})
                  </h2>

                  {data.pastoralRegistrations.length === 0 ? (
                    <p className="text-base text-[#334E68]">
                      Quando um paroquiano se inscrever na aba Pastorais, os
                      dados aparecerão aqui com atalho direto para o WhatsApp
                      dele.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {data.pastoralRegistrations.map((reg) => (
                        <div
                          key={reg.id}
                          className="p-4 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE] space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-base text-[#0E2A47]">
                              {reg.fullName}
                            </span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0E2A47] text-[#F4B942]">
                              {reg.pastoralName}
                            </span>
                          </div>
                          <p className="text-sm text-[#334E68] tabular-nums">
                            WhatsApp: <strong>{reg.phone}</strong> ·{" "}
                            {reg.availability}
                          </p>
                          {reg.message && (
                            <p className="text-sm text-[#0F2236]">
                              “{reg.message}”
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleAddPastoral}
                  className="bg-[#F1ECE1] border border-[#D8CEBE] rounded-2xl p-6 space-y-4"
                >
                  <h2 className="font-display text-2xl font-bold text-[#0E2A47]">
                    Cadastrar Nova Pastoral ou Movimento
                  </h2>

                  <div>
                    <label
                      htmlFor="past-name"
                      className="block font-bold text-sm text-[#0E2A47] mb-1"
                    >
                      Nome da Pastoral / Movimento *
                    </label>
                    <input
                      id="past-name"
                      type="text"
                      required
                      value={pastName}
                      onChange={(e) => setPastName(e.target.value)}
                      placeholder="Ex.: Pastoral da Acolhida"
                      className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="past-type"
                        className="block font-bold text-sm text-[#0E2A47] mb-1"
                      >
                        Tipo
                      </label>
                      <input
                        id="past-type"
                        type="text"
                        value={pastType}
                        onChange={(e) => setPastType(e.target.value)}
                        className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="past-sched"
                        className="block font-bold text-sm text-[#0E2A47] mb-1"
                      >
                        Dias de Encontro / Atuação
                      </label>
                      <input
                        id="past-sched"
                        type="text"
                        value={pastSchedule}
                        onChange={(e) => setPastSchedule(e.target.value)}
                        placeholder="Ex.: Sábados às 15h"
                        className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="past-desc"
                      className="block font-bold text-sm text-[#0E2A47] mb-1"
                    >
                      Descrição da Missão
                    </label>
                    <textarea
                      id="past-desc"
                      rows={3}
                      value={pastDescription}
                      onChange={(e) => setPastDescription(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="min-h-13 w-full px-5 py-3 rounded-xl bg-[#0E2A47] text-[#FAF8F5] font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus
                      aria-hidden="true"
                      className="w-5 h-5 text-[#F4B942]"
                    />
                    <span>Adicionar Pastoral à Lista</span>
                  </button>
                </form>
              </div>

              <div className="lg:col-span-6 space-y-3">
                <h2 className="font-display text-2xl font-bold text-[#0E2A47]">
                  Pastorais Ativas ({data.pastorals.length})
                </h2>
                {data.pastorals.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-[#F1ECE1] border border-[#D8CEBE] flex items-center justify-between gap-3"
                  >
                    <div>
                      <h3 className="font-bold text-base text-[#0E2A47]">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#334E68]">
                        {p.type} · {p.schedule}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        deletePastoral(p.id);
                        notify("Pastoral removida.");
                      }}
                      aria-label={`Remover ${p.name}`}
                      className="min-h-11 px-3 py-2 rounded-lg bg-[#9E2A2B] text-[#FAF8F5] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 aria-hidden="true" className="w-4 h-4" />
                      <span>Excluir</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 4: ACERVO HISTÓRICO E VELÁRIO VIRTUAL */}
          {activeTab === "historia-velario" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <form
                onSubmit={handleAddHistory}
                className="lg:col-span-6 bg-[#F1ECE1] border border-[#D8CEBE] rounded-2xl p-6 space-y-4"
              >
                <h2 className="font-display text-2xl font-bold text-[#0E2A47]">
                  Adicionar Foto Antiga / Relato na História da Paróquia
                </h2>

                <div>
                  <label
                    htmlFor="hist-title"
                    className="block font-bold text-sm text-[#0E2A47] mb-1"
                  >
                    Título do Capítulo ou Memória *
                  </label>
                  <input
                    id="hist-title"
                    type="text"
                    required
                    value={histTitle}
                    onChange={(e) => setHistTitle(e.target.value)}
                    placeholder="Ex.: Primeira Festa da Padroeira na Praça"
                    className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="hist-period"
                      className="block font-bold text-sm text-[#0E2A47] mb-1"
                    >
                      Década ou Ano
                    </label>
                    <input
                      id="hist-period"
                      type="text"
                      value={histPeriod}
                      onChange={(e) => setHistPeriod(e.target.value)}
                      placeholder="Ex.: Década de 1970"
                      className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hist-image"
                      className="block font-bold text-sm text-[#0E2A47] mb-1"
                    >
                      Link/Caminho da Foto Histórica (opcional)
                    </label>
                    <input
                      id="hist-image"
                      type="text"
                      value={histImageUrl}
                      onChange={(e) => setHistImageUrl(e.target.value)}
                      placeholder="/images/foto-historica.jpg"
                      className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="hist-summary"
                    className="block font-bold text-sm text-[#0E2A47] mb-1"
                  >
                    Relato Histórico *
                  </label>
                  <textarea
                    id="hist-summary"
                    rows={4}
                    required
                    value={histSummary}
                    onChange={(e) => setHistSummary(e.target.value)}
                    placeholder="Escreva a história contada pelos paroquianos..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="hist-note"
                    className="block font-bold text-sm text-[#0E2A47] mb-1"
                  >
                    Legenda da Foto / Fonte do Acervo
                  </label>
                  <input
                    id="hist-note"
                    type="text"
                    value={histNote}
                    onChange={(e) => setHistNote(e.target.value)}
                    placeholder="Ex.: Acervo cedido pelo Sr. João..."
                    className="w-full min-h-12 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE]"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-13 w-full px-5 py-3 rounded-xl bg-[#0E2A47] text-[#FAF8F5] font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus aria-hidden="true" className="w-5 h-5 text-[#F4B942]" />
                  <span>Publicar na Página de História</span>
                </button>
              </form>

              <div className="lg:col-span-6 space-y-6">
                <div className="bg-[#F1ECE1] border border-[#D8CEBE] rounded-2xl p-6 space-y-4">
                  <h2 className="font-display text-2xl font-bold text-[#0E2A47] flex items-center gap-2">
                    <Flame
                      aria-hidden="true"
                      className="w-6 h-6 text-[#9A701E]"
                    />
                    <span>
                      Últimas Intenções no Velário Virtual (
                      {data.candles.length})
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {data.candles.slice(0, 6).map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#D8CEBE] space-y-1"
                      >
                        <div className="flex justify-between text-sm font-bold text-[#0E2A47]">
                          <span>{c.name}</span>
                          <span className="text-xs text-[#9A701E]">
                            {c.category} {!c.isPublic ? "(Reservada ao Altar)" : ""}
                          </span>
                        </div>
                        <p className="text-sm text-[#0F2236]">{c.intention}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display text-xl font-bold text-[#0E2A47]">
                    Capítulos Históricos Publicados ({data.historyChapters.length})
                  </h3>
                  {data.historyChapters.map((h) => (
                    <div
                      key={h.id}
                      className="p-4 rounded-xl bg-[#F1ECE1] border border-[#D8CEBE] flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-base text-[#0E2A47]">
                          {h.title}
                        </p>
                        <p className="text-xs text-[#334E68]">{h.period}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          deleteHistoryChapter(h.id);
                          notify("Capítulo histórico removido.");
                        }}
                        className="min-h-11 px-3 py-2 rounded-lg bg-[#9E2A2B] text-[#FAF8F5] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 aria-hidden="true" className="w-4 h-4" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
