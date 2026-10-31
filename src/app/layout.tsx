import type { Metadata } from "next";
import "./globals.css";
import { ParishProvider } from "@/context/ParishContext";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Paróquia da Imaculada",
  description:
    "Site oficial da Paróquia da Imaculada (Praça Prof. Paulo José Otaviano, 2 - São Bernardo, Campinas - SP). Horários de Missa, Confissão, Igreja Aberta, Sacramentos, Velário Virtual de Intenções, Pastorais, História e Calendário Paroquial.",
  icons: {
    icon: asset("/images/brasao-imaculada.png"),
    shortcut: asset("/images/brasao-imaculada.png"),
    apple: asset("/images/brasao-imaculada.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@600;700;800&family=Oswald:wght@300;400;500&family=Source+Sans+3:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-dvh bg-[#FAF8F5] text-[#0F2236] antialiased">
        <ParishProvider>
          <SmoothScrollProvider>
            <Navbar />
            <main id="conteudo-principal" className="flex-1">
              {children}
            </main>
            <Footer />
          </SmoothScrollProvider>
        </ParishProvider>
      </body>
    </html>
  );
}
