import { NextResponse } from "next/server";
import { getStorage } from "@/lib/storage";

export const runtime = "nodejs";

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
    const storage = getStorage();
    if (!storage.logVisit) {
      return NextResponse.json({ skipped: "provider-no-logVisit" });
    }
    await storage.logVisit({
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
