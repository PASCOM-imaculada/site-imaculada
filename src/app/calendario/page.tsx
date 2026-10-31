"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParish } from "@/context/ParishContext";

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function CalendarioPage() {
  const { data } = useParish();
  const { events } = data;

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(
    null
  );

  const daysInMonth = useMemo(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const cells: Array<{ day: number | null; dateStr: string | null }> = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ day: null, dateStr: null });
    }
    for (let d = 1; d <= totalDays; d++) {
      const mm = String(currentMonth + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      cells.push({
        day: d,
        dateStr: `${currentYear}-${mm}-${dd}`,
      });
    }
    return cells;
  }, [currentYear, currentMonth]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof events> = {};
    for (const evt of events) {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    }
    return map;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!selectedDateFilter) return events;
    return events.filter((evt) => evt.date === selectedDateFilter);
  }, [events, selectedDateFilter]);

  function handlePrevMonth() {
    setSelectedDateFilter(null);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    setSelectedDateFilter(null);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  return (
    <div className="bg-[#FAF8F5] text-[#0F2236] py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0E2A47]">
              Agenda Paroquial
            </h1>
            <p className="text-base text-[#334E68]">
              Celebrações especiais, festas litúrgicas e encontros.
            </p>
          </div>

          <Link
            href="/admin"
            className="text-xs font-semibold text-[#334E68] hover:text-[#0E2A47] transition-colors"
          >
            Gerenciar eventos (Secretaria) →
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Grade Mensal Limpa (5 Colunas) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Mês anterior"
                className="w-9 h-9 rounded-full hover:bg-[#0E2A47]/8 flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft aria-hidden="true" className="w-4 h-4" />
              </button>

              <h2 className="font-display text-lg font-semibold text-[#0E2A47] tabular-nums">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Próximo mês"
                className="w-9 h-9 rounded-full hover:bg-[#0E2A47]/8 flex items-center justify-center cursor-pointer"
              >
                <ChevronRight aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS_SHORT.map((wd) => (
                <div
                  key={wd}
                  className="py-1 text-xs font-medium text-[#334E68]/70"
                >
                  {wd}
                </div>
              ))}

              {daysInMonth.map((cell, idx) => {
                if (!cell.day || !cell.dateStr) {
                  return <div key={`empty-${idx}`} className="h-10" />;
                }

                const hasEvents = Boolean(eventsByDate[cell.dateStr]?.length);
                const isSelected = selectedDateFilter === cell.dateStr;

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() =>
                      setSelectedDateFilter(isSelected ? null : cell.dateStr)
                    }
                    className={`h-10 rounded-lg text-sm tabular-nums flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#C89B3C] text-[#0E2A47] font-bold"
                        : hasEvents
                        ? "bg-[#0E2A47] text-[#FAF8F5] font-semibold"
                        : "text-[#0F2236] hover:bg-[#0E2A47]/8"
                    }`}
                  >
                    <span>{cell.day}</span>
                  </button>
                );
              })}
            </div>

            {selectedDateFilter && (
              <button
                type="button"
                onClick={() => setSelectedDateFilter(null)}
                className="text-xs font-semibold text-[#0E2A47] underline cursor-pointer"
              >
                Mostrar todas as datas
              </button>
            )}
          </div>

          {/* Lista de Eventos (7 Colunas) */}
          <div className="lg:col-span-7 divide-y divide-[#0E2A47]/12 border-y border-[#0E2A47]/12">
            {filteredEvents.map((evt) => {
              const [year, month, day] = evt.date.split("-");
              return (
                <article key={evt.id} className="py-6 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-4 tabular-nums">
                    <span className="text-xs font-semibold text-[#9A701E]">
                      {day}/{month}/{year} · {evt.time}
                    </span>
                    <span className="text-xs text-[#334E68]">
                      {evt.category}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#0E2A47]">
                    {evt.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#334E68]">
                    {evt.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
