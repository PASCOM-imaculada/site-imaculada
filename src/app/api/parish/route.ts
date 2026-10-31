import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import initialData from "@/data/parish-store.json";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "parish-store.json");

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json(initialData);
  }
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json();
    try {
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), "utf-8");
    } catch {
      // Se estiver em ambiente read-only de produção sem banco externo, retorna sucesso para sincronizar no cliente
    }
    return NextResponse.json({ ok: true, data: updatedData });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Erro ao salvar dados" },
      { status: 400 }
    );
  }
}
