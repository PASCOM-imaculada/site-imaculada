import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Velário Virtual",
  description: "Acenda uma vela e envie sua intenção de oração à Paróquia da Imaculada.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
