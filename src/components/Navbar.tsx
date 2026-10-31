"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useParish } from "@/context/ParishContext";
import { asset } from "@/lib/asset";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/sacramentos", label: "Sacramentos" },
  { href: "/velario", label: "Velário" },
  { href: "/pastorais", label: "Pastorais" },
  { href: "/historia", label: "História" },
  { href: "/calendario", label: "Agenda" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data } = useParish();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${data.parishInfo.whatsappNumber}?text=${encodeURIComponent(
    "Olá! Paz e Bem. Gostaria de uma informação na Secretaria da Paróquia da Imaculada."
  )}`;

  const useTransparentHeroBar = isHome && !scrolled && !mobileMenuOpen;

  return (
    <>
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[#0E2A47] focus:text-[#FAF8F5] focus:px-4 focus:py-2 focus:rounded-md focus:text-sm"
      >
        Pular para o conteúdo
      </a>

      <header
        className={`fixed top-0 inset-x-0 z-40 h-14 transition-all duration-300 ${
          useTransparentHeroBar
            ? "bg-gradient-to-b from-black/35 to-transparent text-[#FAF8F5]"
            : "bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#0E2A47]/8 text-[#0E2A47]"
        }`}
      >
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-6">
          <Link
            href="/"
            className={`inline-flex items-center gap-2.5 font-display text-base sm:text-lg font-semibold tracking-tight py-1.5 transition-colors ${
              useTransparentHeroBar
                ? "text-[#FAF8F5] drop-shadow-xs"
                : "text-[#0E2A47]"
            }`}
          >
            <img
              src={asset("/images/brasao-imaculada.png")}
              alt="Brasão da Paróquia da Imaculada"
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            />
            <span>Paróquia da Imaculada</span>
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-6"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`py-2 text-sm font-medium transition-colors relative ${
                    useTransparentHeroBar
                      ? isActive
                        ? "text-[#FAF8F5] font-semibold after:content-[''] after:absolute after:bottom-0.5 after:inset-x-0 after:h-[1.5px] after:bg-[#F4B942]"
                        : "text-[#FAF8F5]/85 hover:text-[#FAF8F5]"
                      : isActive
                      ? "text-[#0E2A47] font-semibold after:content-[''] after:absolute after:bottom-0.5 after:inset-x-0 after:h-[1.5px] after:bg-[#C89B3C]"
                      : "text-[#334E68] hover:text-[#0E2A47]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                useTransparentHeroBar
                  ? "text-[#FAF8F5] border border-[#FAF8F5]/45 hover:bg-[#FAF8F5]/15"
                  : "text-[#0E2A47] border border-[#0E2A47]/20 hover:border-[#0E2A47]"
              }`}
            >
              WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="menu-mobile-minimal"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              className={`md:hidden w-10 h-10 flex items-center justify-center cursor-pointer ${
                useTransparentHeroBar ? "text-[#FAF8F5]" : "text-[#0E2A47]"
              }`}
            >
              {mobileMenuOpen ? (
                <X aria-hidden="true" className="w-5 h-5" />
              ) : (
                <Menu aria-hidden="true" className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            id="menu-mobile-minimal"
            aria-label="Menu móvel"
            className="md:hidden bg-[#FAF8F5] text-[#0E2A47] border-b border-[#0E2A47]/10 px-6 py-5 space-y-3"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`block py-2 text-base ${
                    isActive
                      ? "font-semibold text-[#0E2A47]"
                      : "text-[#334E68]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-[#0E2A47]/10 flex items-center justify-between text-sm">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0E2A47]"
              >
                WhatsApp Secretaria
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#334E68]"
              >
                Secretaria
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
