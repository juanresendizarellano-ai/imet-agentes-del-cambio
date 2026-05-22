import { NextResponse } from "next/server";
import {
  saveLeadToSupabase,
  updateLeadInSupabase,
  type LeadInput,
} from "@/lib/storage/supabase";
import { pushMiniLeadToCrm } from "@/lib/storage/imet-crm";

export const runtime = "nodejs";

type Payload = {
  full_name: string;
  phone: string;
  age: number;
  program_type: "licenciatura" | "maestria";
};

function validate(
  p: Partial<Payload>
): { ok: true; data: Payload } | { ok: false; error: string } {
  if (!p.full_name || p.full_name.trim().length < 3) {
    return { ok: false, error: "Ingresa tu nombre completo" };
  }
  if (!p.phone || p.phone.trim().length < 10) {
    return { ok: false, error: "Teléfono inválido (mínimo 10 dígitos)" };
  }
  if (!p.age || typeof p.age !== "number" || p.age < 15 || p.age > 99) {
    return { ok: false, error: "Edad inválida" };
  }
  if (p.program_type !== "licenciatura" && p.program_type !== "maestria") {
    return { ok: false, error: "Selecciona licenciatura o maestría" };
  }
  return {
    ok: true,
    data: {
      full_name: p.full_name.trim(),
      phone: p.phone.trim(),
      age: p.age,
      program_type: p.program_type,
    },
  };
}

/**
 * Captura de leads desde el mini-form del hero.
 *
 * Flujo dual:
 *   1. Guardar en Supabase (must succeed) — control de campana propio.
 *   2. Pushear al CRM iMET via round-robin (best-effort) — para que un
 *      asesor lo contacte. Si falla, el lead queda en Supabase con
 *      crm_push_status='failed' para reintento manual.
 *
 * Por que dual: el usuario quiere control de la campana ademas del CRM,
 * porque el CRM no expone reportes finos por campana al equipo de marketing.
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

  const leadInput: LeadInput = {
    ...result.data,
    ip_address: ip,
    user_agent: userAgent,
    source: "landing-pepe-canto-mini-form",
  };

  // 1. Supabase first — si esto falla, abortamos.
  let savedLead;
  try {
    savedLead = await saveLeadToSupabase(leadInput);
  } catch (err) {
    console.error("Lead supabase save error:", err);
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json(
      { error: `No se pudo guardar tu registro. ${msg}` },
      { status: 500 }
    );
  }

  // 2. CRM push — best-effort. No bloquea la respuesta al usuario.
  try {
    const crm = await pushMiniLeadToCrm(result.data);
    await updateLeadInSupabase(savedLead.id, {
      crm_lead_id: crm.crm_lead_id,
      crm_push_status: "success",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    console.error("Lead CRM push error:", err);
    await updateLeadInSupabase(savedLead.id, {
      crm_push_status: "failed",
      crm_push_error: msg.slice(0, 500),
    });
    // No regresamos error al usuario: el lead esta capturado en Supabase y
    // el equipo de marketing puede reintentarlo manualmente.
  }

  return NextResponse.json({
    id: savedLead.id,
    created_at: savedLead.created_at,
  });
}
