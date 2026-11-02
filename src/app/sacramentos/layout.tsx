import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sacramentos",
  description: "Orientações e documentos para Batismo, Eucaristia, Crisma, Confissão, Matrimônio e Unção dos Enfermos.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
