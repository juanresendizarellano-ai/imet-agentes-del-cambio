import { NextResponse } from "next/server";
import { getStorage } from "@/lib/storage";
import {
  LICENCIATURAS_ESCOLARIZADA_EJECUTIVA,
  LICENCIATURAS_VIRTUAL,
  MAESTRIAS_EJECUTIVA,
  MAESTRIAS_VIRTUAL,
} from "@/lib/programs";

export const runtime = "nodejs";

type Payload = {
  full_name: string;
  phone: string;
  age: number;
  address: string;
  reason: string;
  program_type: "licenciatura" | "maestria";
  licenciatura_escolarizada_ejecutiva: string | null;
  licenciatura_virtual: string | null;
  maestria_ejecutiva: string | null;
  maestria_virtual: string | null;
};

function isOneOf<T extends readonly string[]>(
  value: unknown,
  options: T
): value is T[number] {
  return typeof value === "string" && (options as readonly string[]).includes(value);
}

function validate(p: Partial<Payload>): { ok: true; data: Payload } | { ok: false; error: string } {
  if (!p.full_name || p.full_name.trim().length < 3) {
    return { ok: false, error: "Nombre inválido" };
  }
  if (!p.phone || p.phone.trim().length < 10) {
    return { ok: false, error: "Teléfono inválido" };
  }
  if (!p.age || typeof p.age !== "number" || p.age < 15 || p.age > 99) {
    return { ok: false, error: "Edad inválida" };
  }
  if (!p.address || p.address.trim().length < 3) {
    return { ok: false, error: "Dirección inválida" };
  }
  if (!p.reason || p.reason.trim().length < 20) {
    return { ok: false, error: "Cuéntanos un poco más sobre tu motivación (mínimo 20 caracteres)" };
  }
  if (p.program_type !== "licenciatura" && p.program_type !== "maestria") {
    return { ok: false, error: "Programa inválido" };
  }

  if (p.program_type === "licenciatura") {
    const lee = p.licenciatura_escolarizada_ejecutiva;
    const lv = p.licenciatura_virtual;
    if (lee && !isOneOf(lee, LICENCIATURAS_ESCOLARIZADA_EJECUTIVA)) {
      return { ok: false, error: "Licenciatura escolarizada/ejecutiva inválida" };
    }
    if (lv && !isOneOf(lv, LICENCIATURAS_VIRTUAL)) {
      return { ok: false, error: "Licenciatura virtual inválida" };
    }
    if (!lee && !lv) {
      return { ok: false, error: "Selecciona al menos una licenciatura" };
    }
  } else {
    const me = p.maestria_ejecutiva;
    const mv = p.maestria_virtual;
    if (me && !isOneOf(me, MAESTRIAS_EJECUTIVA)) {
      return { ok: false, error: "Maestría ejecutiva inválida" };
    }
    if (mv && !isOneOf(mv, MAESTRIAS_VIRTUAL)) {
      return { ok: false, error: "Maestría virtual inválida" };
    }
    if (!me && !mv) {
      return { ok: false, error: "Selecciona al menos una maestría" };
    }
  }

  return {
    ok: true,
    data: {
      full_name: p.full_name.trim(),
      phone: p.phone.trim(),
      age: p.age,
      address: p.address.trim(),
      reason: p.reason.trim(),
      program_type: p.program_type,
      licenciatura_escolarizada_ejecutiva:
        p.program_type === "licenciatura"
          ? p.licenciatura_escolarizada_ejecutiva || null
          : null,
      licenciatura_virtual:
        p.program_type === "licenciatura" ? p.licenciatura_virtual || null : null,
      maestria_ejecutiva:
        p.program_type === "maestria" ? p.maestria_ejecutiva || null : null,
      maestria_virtual:
        p.program_type === "maestria" ? p.maestria_virtual || null : null,
    },
  };
}

export async function POST(request: Request) {
  let body: Partial<Payload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;

  try {
    const storage = getStorage();
    const saved = await storage.save({
      ...result.data,
      ip_address: ip,
      user_agent: userAgent,
      source: "landing-pepe-canto",
    });
    return NextResponse.json({ id: saved.id, created_at: saved.created_at });
  } catch (err) {
    console.error("Application submit error:", err);
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json(
      { error: `No se pudo guardar la solicitud. ${msg}` },
      { status: 500 }
    );
  }
}
