import { NextResponse } from "next/server";
import {
  getPreRegisterById,
  savePreRegisterToSupabase,
  type PreRegisterInput,
} from "@/lib/storage/supabase";

export const runtime = "nodejs";

// UUID v4 (y otros) — formato estándar 8-4-4-4-12
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Payload = {
  full_name: string;
  phone: string;
};

function validate(
  p: Partial<Payload>
): { ok: true; data: Payload } | { ok: false; error: string } {
  if (!p.full_name || p.full_name.trim().length < 3) {
    return { ok: false, error: "Ingresa tu nombre completo" };
  }
  if (!p.phone) {
    return { ok: false, error: "Ingresa tu WhatsApp" };
  }
  // Validamos sobre dígitos puros para que el usuario pueda escribir con
  // espacios, guiones o paréntesis sin que truene.
  const digits = p.phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return { ok: false, error: "WhatsApp inválido (mínimo 10 dígitos)" };
  }
  return {
    ok: true,
    data: {
      full_name: p.full_name.trim(),
      phone: p.phone.trim(),
    },
  };
}

/**
 * Lookup de preregistro por id (?id=<uuid>).
 * Lo usa el gate cuando el visitante llega con ?p=<id> en el URL para
 * reconocerlo cross-device sin volver a pedir datos.
 *
 * No expone si un id existe vs no — siempre devuelve 200 con `null` si no
 * encuentra, para no permitir enumeración. (UUIDs son random igual,
 * pero defensa en profundidad.)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim() ?? "";

  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ record: null }, { status: 200 });
  }

  try {
    const record = await getPreRegisterById(id);
    return NextResponse.json({ record });
  } catch (err) {
    console.error("Preregister lookup error:", err);
    return NextResponse.json({ record: null });
  }
}

/**
 * Preregistro del gate de acceso a la landing.
 * Solo Supabase — sin push al CRM por ahora (decisión de campaña).
 * El equipo de Pepe Canto consulta la lista directo desde dashboard.
 */
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

  const input: PreRegisterInput = {
    ...result.data,
    ip_address: ip,
    user_agent: userAgent,
    source: "landing-pepe-canto-gate",
  };

  try {
    const saved = await savePreRegisterToSupabase(input);
    return NextResponse.json({
      id: saved.id,
      created_at: saved.created_at,
    });
  } catch (err) {
    console.error("Preregister save error:", err);
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json(
      { error: `No se pudo guardar tu preregistro. ${msg}` },
      { status: 500 }
    );
  }
}
