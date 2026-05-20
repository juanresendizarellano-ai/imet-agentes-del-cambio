import { createClient } from "@supabase/supabase-js";
import {
  listCampanaLeadsForStats,
  type CampanaLeadStats,
} from "@/lib/storage/imet-crm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

type Stats = {
  totalVisits: number;
  uniqueVisitors: number;
  visitsToday: number;
  totalSubmissions: number;
  submissionsToday: number;
  byProgramType: { licenciatura: number; maestria: number };
  crmError: string | null;
};

async function getSupabaseStats(): Promise<{
  totalVisits: number;
  uniqueVisitors: number;
  visitsToday: number;
  legacyTotal: number;
  legacyToday: number;
  legacyByType: { licenciatura: number; maestria: number };
} | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  const client = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // page_visits + applications (legacy: registros pre-switch al CRM, viven en
  // supabase y no se ven desde el CRM. Los sumamos para que /stats refleje el
  // total real de la campaña).
  const [
    totalRes,
    todayRes,
    allVisitorsRes,
    legacyTotalRes,
    legacyTodayRes,
    legacyByTypeRes,
  ] = await Promise.all([
    client.from("page_visits").select("*", { count: "exact", head: true }),
    client
      .from("page_visits")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString()),
    client.from("page_visits").select("visitor_id"),
    client.from("applications").select("*", { count: "exact", head: true }),
    client
      .from("applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString()),
    client.from("applications").select("program_type"),
  ]);

  const uniqueIds = new Set(
    (allVisitorsRes.data ?? [])
      .map((v: { visitor_id: string | null }) => v.visitor_id)
      .filter(Boolean)
  );

  const legacyByType = { licenciatura: 0, maestria: 0 };
  for (const row of (legacyByTypeRes.data ?? []) as Array<{
    program_type: string | null;
  }>) {
    if (row.program_type === "licenciatura") legacyByType.licenciatura++;
    else if (row.program_type === "maestria") legacyByType.maestria++;
  }

  return {
    totalVisits: totalRes.count ?? 0,
    uniqueVisitors: uniqueIds.size,
    visitsToday: todayRes.count ?? 0,
    legacyTotal: legacyTotalRes.count ?? 0,
    legacyToday: legacyTodayRes.count ?? 0,
    legacyByType,
  };
}

function deriveSubmissionStats(leads: CampanaLeadStats[]) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayMs = startOfToday.getTime();

  const byProgramType = { licenciatura: 0, maestria: 0 };
  let submissionsToday = 0;
  for (const lead of leads) {
    const t = (lead.tipoPrograma || "").toLowerCase();
    if (t === "licenciatura") byProgramType.licenciatura++;
    else if (t.startsWith("maestr")) byProgramType.maestria++; // "Maestria" del CRM

    if (lead.createdAt) {
      const ts = new Date(lead.createdAt).getTime();
      if (!Number.isNaN(ts) && ts >= todayMs) submissionsToday++;
    }
  }
  return { byProgramType, submissionsToday };
}

async function getStats(): Promise<Stats> {
  const supabasePromise = getSupabaseStats().catch((err) => {
    console.error("[stats] supabase stats failed:", err);
    return null;
  });
  const crmPromise = listCampanaLeadsForStats().catch((err) => {
    console.error("[stats] CRM lead fetch failed:", err);
    return { error: err instanceof Error ? err.message : "Error desconocido" } as const;
  });

  const [supa, crm] = await Promise.all([supabasePromise, crmPromise]);

  const supaDefaults = {
    totalVisits: 0,
    uniqueVisitors: 0,
    visitsToday: 0,
    legacyTotal: 0,
    legacyToday: 0,
    legacyByType: { licenciatura: 0, maestria: 0 },
  };
  const s = supa ?? supaDefaults;
  const visitFields = {
    totalVisits: s.totalVisits,
    uniqueVisitors: s.uniqueVisitors,
    visitsToday: s.visitsToday,
  };

  // Si el CRM falla, mostramos solo los legacy (no es 0 — los registros viejos
  // de supabase siguen siendo reales y contables).
  if (crm && "error" in crm) {
    return {
      ...visitFields,
      totalSubmissions: s.legacyTotal,
      submissionsToday: s.legacyToday,
      byProgramType: s.legacyByType,
      crmError: crm.error,
    };
  }

  const leads = crm as CampanaLeadStats[];
  const { byProgramType: crmByType, submissionsToday: crmToday } =
    deriveSubmissionStats(leads);

  return {
    ...visitFields,
    totalSubmissions: leads.length + s.legacyTotal,
    submissionsToday: crmToday + s.legacyToday,
    byProgramType: {
      licenciatura: crmByType.licenciatura + s.legacyByType.licenciatura,
      maestria: crmByType.maestria + s.legacyByType.maestria,
    },
    crmError: null,
  };
}

function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "aqua" | "navy" | "amber";
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-white border-slate-200 text-imet-navy",
    aqua: "bg-aqua-gradient border-transparent text-white shadow-imet-aqua/30 shadow-lg",
    navy: "bg-imet-navy border-transparent text-white",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
  };
  const labelClass =
    tone === "aqua" || tone === "navy"
      ? "text-white/70"
      : tone === "amber"
      ? "text-amber-700"
      : "text-slate-500";
  const hintClass =
    tone === "aqua" || tone === "navy"
      ? "text-white/60"
      : tone === "amber"
      ? "text-amber-600"
      : "text-slate-400";

  return (
    <div
      className={`rounded-2xl border p-6 transition hover:-translate-y-0.5 hover:shadow-md ${toneClasses[tone]}`}
    >
      <div
        className={`text-[10px] font-bold uppercase tracking-widest ${labelClass}`}
      >
        {label}
      </div>
      <div className="mt-2 text-4xl font-black leading-none md:text-5xl">
        {value}
      </div>
      {hint ? <div className={`mt-2 text-xs ${hintClass}`}>{hint}</div> : null}
    </div>
  );
}

export default async function StatsPage() {
  const stats = await getStats();
  const {
    totalVisits,
    uniqueVisitors,
    visitsToday,
    totalSubmissions,
    submissionsToday,
    byProgramType,
    crmError,
  } = stats;

  const conversionRate =
    uniqueVisitors > 0
      ? ((totalSubmissions / uniqueVisitors) * 100).toFixed(1) + "%"
      : "—";

  const updatedAt = new Date().toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="min-h-screen bg-imet-cream p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-imet-mint px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-imet-aqua-dark">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-imet-aqua-dark" />
            Métricas en vivo
          </div>
          <h1 className="mt-3 text-3xl font-black text-imet-navy md:text-4xl">
            Agentes del Cambio · Pepe Canto Tamayo
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Actualizado {updatedAt} · Refresca la página para datos nuevos
          </p>
        </header>

        {crmError ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>CRM temporalmente sin respuesta.</strong> Los conteos de
            formularios pueden estar desactualizados. Detalle: {crmError}
          </div>
        ) : null}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            tone="aqua"
            label="Visitas únicas"
            value={uniqueVisitors.toLocaleString("es-MX")}
            hint={`${totalVisits.toLocaleString("es-MX")} pageviews totales`}
          />
          <StatCard
            tone="navy"
            label="Formularios enviados"
            value={totalSubmissions.toLocaleString("es-MX")}
            hint={`${submissionsToday} hoy`}
          />
          <StatCard
            label="Tasa de conversión"
            value={conversionRate}
            hint="Formularios / Visitas únicas"
          />
        </section>

        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Visitas hoy"
            value={visitsToday.toLocaleString("es-MX")}
          />
          <StatCard
            label="Licenciatura"
            value={byProgramType.licenciatura.toLocaleString("es-MX")}
            hint="Formularios elegidos"
          />
          <StatCard
            label="Maestría"
            value={byProgramType.maestria.toLocaleString("es-MX")}
            hint="Formularios elegidos"
          />
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          Página pública · Solo conteos agregados, sin datos personales
        </footer>
      </div>
    </main>
  );
}
