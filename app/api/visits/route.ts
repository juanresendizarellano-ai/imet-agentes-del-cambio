import { NextResponse } from "next/server";
import { supabaseAdapter } from "@/lib/storage/supabase";

export const runtime = "nodejs";

// Las visitas SIEMPRE se loguean a Supabase, sin importar STORAGE_PROVIDER.
// Si STORAGE_PROVIDER=imet-crm, el adapter del CRM no tiene logVisit (no es
// su trabajo), pero seguimos necesitando contar visitas en /stats publico.
// Por eso importamos el supabaseAdapter directo aqui.

type VisitPayload = {
  path?: string;
  visitor_id?: string;
  referrer?: string;
};

export async function POST(request: Request) {
  let body: VisitPayload = {};
  try {
    body = await request.json();
  } catch {
    // ignorar — no es crítico, igual logueamos lo que tengamos
  }

  // Filtros básicos anti-bot: requerir UA no vacío
  const userAgent = request.headers.get("user-agent");
  if (!userAgent) {
    return NextResponse.json({ skipped: "no-ua" });
  }

  // Filtrar bots conocidos por user-agent (heurística simple)
  const ua = userAgent.toLowerCase();
  const isBot =
    ua.includes("bot") ||
    ua.includes("crawler") ||
    ua.includes("spider") ||
    ua.includes("preview") ||
    ua.includes("scraper");
  if (isBot) {
    return NextResponse.json({ skipped: "bot" });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  try {
    await supabaseAdapter.logVisit!({
      path: body.path || "/",
      ip_address: ip,
      user_agent: userAgent,
      referrer: body.referrer || request.headers.get("referer") || null,
      visitor_id: body.visitor_id || null,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Visit log error:", err);
    // No exponer error al cliente — fire-and-forget
    return NextResponse.json({ ok: false });
  }
}
