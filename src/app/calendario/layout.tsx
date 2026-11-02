import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda Paroquial",
  description: "Celebrações especiais, festas litúrgicas e encontros da Paróquia da Imaculada.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
