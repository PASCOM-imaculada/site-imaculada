"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import initialStoreData from "@/data/parish-store.json";
import {
  HistoryChapter,
  MassSchedule,
  ParishEvent,
  ParishInfo,
  ParishStoreData,
  Pastoral,
  PastoralRegistration,
  VirtualCandle,
} from "@/types/parish";

interface ParishContextValue {
  data: ParishStoreData;
  isLoaded: boolean;
  addCandle: (candle: Omit<VirtualCandle, "id" | "createdAt">) => Promise<VirtualCandle>;
  addEvent: (event: Omit<ParishEvent, "id">) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addPastoral: (pastoral: Omit<Pastoral, "id">) => Promise<void>;
  deletePastoral: (id: string) => Promise<void>;
  addHistoryChapter: (chapter: Omit<HistoryChapter, "id">) => Promise<void>;
  deleteHistoryChapter: (id: string) => Promise<void>;
  addPastoralRegistration: (
    reg: Omit<PastoralRegistration, "id" | "createdAt">
  ) => Promise<PastoralRegistration>;
  updateMassSchedule: (schedule: MassSchedule) => Promise<void>;
  updateParishInfo: (info: Partial<ParishInfo>) => Promise<void>;
}

const STORAGE_KEY = "paroquia_imaculada_campinas_v2";

const ParishContext = createContext<ParishContextValue | null>(null);

export function ParishProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ParishStoreData>(
    initialStoreData as unknown as ParishStoreData
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadStore() {
      try {
        const res = await fetch("/api/parish", { cache: "no-store" });
        if (res.ok) {
          const serverData = await res.json();
          setData(serverData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
          setIsLoaded(true);
          return;
        }
      } catch {
        // Fallback para localStorage se offline
      }

      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setData(JSON.parse(cached));
        }
      } catch {
        // Ignore storage errors
      }
      setIsLoaded(true);
    }

    loadStore();
  }, []);

  async function persist(nextData: ParishStoreData) {
    setData(nextData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    } catch {
      // Ignore localStorage quota errors
    }
    try {
      await fetch("/api/parish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextData),
      });
    } catch {
      // Ignore network errors on static preview
    }
  }

  async function addCandle(candleInput: Omit<VirtualCandle, "id" | "createdAt">) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newCandle: VirtualCandle = {
      ...candleInput,
      id: `vela-${Date.now()}`,
      createdAt: `Agora mesmo (${timeStr})`,
    };
    const nextData: ParishStoreData = {
      ...data,
      candles: [newCandle, ...data.candles],
    };
    await persist(nextData);
    return newCandle;
  }

  async function addEvent(eventInput: Omit<ParishEvent, "id">) {
    const newEvent: ParishEvent = {
      ...eventInput,
      id: `evt-${Date.now()}`,
    };
    const nextData: ParishStoreData = {
      ...data,
      events: [...data.events, newEvent].sort((a, b) => a.date.localeCompare(b.date)),
    };
    await persist(nextData);
  }

  async function deleteEvent(id: string) {
    const nextData: ParishStoreData = {
      ...data,
      events: data.events.filter((e) => e.id !== id),
    };
    await persist(nextData);
  }

  async function addPastoral(pastoralInput: Omit<Pastoral, "id">) {
    const newPastoral: Pastoral = {
      ...pastoralInput,
      id: `past-${Date.now()}`,
    };
    const nextData: ParishStoreData = {
      ...data,
      pastorals: [...data.pastorals, newPastoral],
    };
    await persist(nextData);
  }

  async function deletePastoral(id: string) {
    const nextData: ParishStoreData = {
      ...data,
      pastorals: data.pastorals.filter((p) => p.id !== id),
    };
    await persist(nextData);
  }

  async function addHistoryChapter(chapterInput: Omit<HistoryChapter, "id">) {
    const newChapter: HistoryChapter = {
      ...chapterInput,
      id: `hist-${Date.now()}`,
    };
    const nextData: ParishStoreData = {
      ...data,
      historyChapters: [...data.historyChapters, newChapter],
    };
    await persist(nextData);
  }

  async function deleteHistoryChapter(id: string) {
    const nextData: ParishStoreData = {
      ...data,
      historyChapters: data.historyChapters.filter((h) => h.id !== id),
    };
    await persist(nextData);
  }

  async function addPastoralRegistration(
    regInput: Omit<PastoralRegistration, "id" | "createdAt">
  ) {
    const now = new Date();
    const newReg: PastoralRegistration = {
      ...regInput,
      id: `insc-${Date.now()}`,
      createdAt: now.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const nextData: ParishStoreData = {
      ...data,
      pastoralRegistrations: [newReg, ...data.pastoralRegistrations],
    };
    await persist(nextData);
    return newReg;
  }

  async function updateMassSchedule(schedule: MassSchedule) {
    const nextData: ParishStoreData = {
      ...data,
      massSchedules: data.massSchedules.map((s) =>
        s.id === schedule.id ? schedule : s
      ),
    };
    await persist(nextData);
  }

  async function updateParishInfo(info: Partial<ParishInfo>) {
    const nextData: ParishStoreData = {
      ...data,
      parishInfo: {
        ...data.parishInfo,
        ...info,
      },
    };
    await persist(nextData);
  }

  return (
    <ParishContext.Provider
      value={{
        data,
        isLoaded,
        addCandle,
        addEvent,
        deleteEvent,
        addPastoral,
        deletePastoral,
        addHistoryChapter,
        deleteHistoryChapter,
        addPastoralRegistration,
        updateMassSchedule,
        updateParishInfo,
      }}
    >
      {children}
    </ParishContext.Provider>
  );
}

export function useParish() {
  const ctx = useContext(ParishContext);
  if (!ctx) {
    throw new Error("useParish deve ser utilizado dentro de um ParishProvider");
  }
  return ctx;
}
