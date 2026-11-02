import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pastorais e Movimentos",
  description: "Conheça as pastorais e os movimentos da Paróquia da Imaculada e saiba como participar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
