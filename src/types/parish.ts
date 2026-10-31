export interface ParishInfo {
  name: string;
  subtitle: string;
  address: string;
  cityState: string;
  cep: string;
  forania: string;
  phone?: string;
  whatsapp: string;
  whatsappNumber: string;
  instagram: string;
  youtube: string;
  facebook: string;
  pixKey: string;
  pixHolder: string;
  pixBank: string;
  churchOpenHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    note: string;
  };
}

export interface MassSchedule {
  id: string;
  day: string;
  badge: string;
  times: string[];
  description: string;
}

export interface ParishEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: "Liturgia" | "Festa da Padroeira" | "Pastoral" | "Movimento" | "Comunidade";
  location: string;
  description: string;
}

export interface Pastoral {
  id: string;
  name: string;
  type: string;
  schedule: string;
  coordinator: string;
  description: string;
}

export interface VirtualCandle {
  id: string;
  name: string;
  category: "Ação de Graças" | "Saúde e Enfermos" | "Família e Juventude" | "Intenção Especial";
  intention: string;
  createdAt: string;
  isPublic: boolean;
}

export interface HistoryChapter {
  id: string;
  era: string;
  period: string;
  title: string;
  summary: string;
  note: string;
  imageUrl?: string;
}

export interface PastoralRegistration {
  id: string;
  fullName: string;
  phone: string;
  pastoralName: string;
  availability: string;
  message: string;
  createdAt: string;
}

export interface ParishStoreData {
  parishInfo: ParishInfo;
  massSchedules: MassSchedule[];
  events: ParishEvent[];
  pastorals: Pastoral[];
  candles: VirtualCandle[];
  historyChapters: HistoryChapter[];
  pastoralRegistrations: PastoralRegistration[];
}
