import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossa História",
  description: "A memória da Paróquia da Imaculada no bairro São Bernardo, em Campinas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
