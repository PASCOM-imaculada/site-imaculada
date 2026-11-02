"use client";

import React from "react";
import { useParish } from "@/context/ParishContext";
import { asset } from "@/lib/asset";

export function Footer() {
  const { data } = useParish();
  const info = data.parishInfo;

  return (
    <footer className="bg-[#FAF8F5] text-[#334E68] border-t border-[#0E2A47]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm">
        <div className="flex items-center gap-4">
          <img
            src={asset("/images/brasao-imaculada.png")}
            alt="Brasão da Paróquia da Imaculada"
            width={52}
            height={52}
            className="w-12 h-12 object-contain shrink-0"
          />
          <div className="space-y-1">
            <p className="font-display text-base font-semibold text-[#0E2A47]">
              {info.name}
            </p>
            <p className="text-[#334E68]">
              {info.address} · {info.cityState}
            </p>
            <p className="text-xs sm:text-sm text-[#334E68] tabular-nums">
              Telefone: {info.phone} · WhatsApp: {info.whatsapp}
            </p>
            <p className="text-xs text-[#334E68]/70">{info.forania}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm">
          <a
            href={info.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0E2A47] transition-colors py-1"
          >
            Instagram
          </a>
          <a
            href={info.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0E2A47] transition-colors py-1"
          >
            YouTube
          </a>
          <a
            href={info.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0E2A47] transition-colors py-1"
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
