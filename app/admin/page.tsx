import { getStorage } from "@/lib/storage";
import type { ApplicationRecord, VisitStats } from "@/lib/storage/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DashboardData = {
  data: ApplicationRecord[];
  providerName: string;
  visitStats: VisitStats | null;
};

async function getDashboardData(
  adminPassword: string | undefined
): Promise<DashboardData | { unsupported: true; providerName: string } | null> {
  // Trim defensivo: Vercel a veces guarda env vars con whitespace invisible
  // si se pegan con saltos de línea al final del valor.
  const envPwd = (process.env.ADMIN_PASSWORD || "").trim();
  const inputPwd = (adminPassword || "").trim();
  if (!inputPwd || !envPwd || inputPwd !== envPwd) {
    return null;
  }
  const storage = getStorage();
  if (!storage.list) {
    return { unsupported: true, providerName: storage.name };
  }
  const [apps, visitStats] = await Promise.all([
    storage.list(500),
    storage.visitStats ? storage.visitStats() : Promise.resolve(null),
  ]);
  return { data: apps, providerName: storage.name, visitStats };
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
      className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${toneClasses[tone]}`}
    >
      <div
        className={`text-[10px] font-bold uppercase tracking-widest ${labelClass}`}
      >
        {label}
      </div>
      <div className="mt-2 text-3xl font-black leading-none">{value}</div>
      {hint ? <div className={`mt-1.5 text-xs ${hintClass}`}>{hint}</div> : null}
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const params = await searchParams;
  const result = await getDashboardData(params.key);

  if (!result) {
    return (
      <main className="min-h-screen bg-imet-cream p-10">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-4 text-xl font-bold text-imet-navy">
            Acceso restringido
          </h1>
          <p className="mb-4 text-sm text-slate-600">
            Agrega <code className="rounded bg-slate-100 px-1">?key=tu-clave</code>{" "}
            a la URL para acceder al panel.
          </p>
          <p className="text-xs text-slate-500">
            Configura <code>ADMIN_PASSWORD</code> en tus variables de entorno.
          </p>
        </div>
      </main>
    );
  }

  if ("unsupported" in result) {
    return (
      <main className="min-h-screen bg-imet-cream p-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-3 text-xl font-bold text-imet-navy">
            Lectura no disponible
          </h1>
          <p className="text-sm text-slate-600">
            El provider <strong>{result.providerName}</strong> solo soporta
            escritura. Las leads están en tu CRM — revísalas ahí directamente.
          </p>
        </div>
      </main>
    );
  }

  const { data: apps, providerName, visitStats } = result;

  // Cálculos derivados
  const totalRegs = apps.length;
  const now = Date.now();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayMs = startOfToday.getTime();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const regsToday = apps.filter(
    (a) => new Date(a.created_at).getTime() >= todayMs
  ).length;
  const regs7d = apps.filter(
    (a) => new Date(a.created_at).getTime() >= sevenDaysAgo
  ).length;

  const byStatus = apps.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalVisits = visitStats?.total_visits ?? 0;
  const uniqueVisitors = visitStats?.unique_visitors ?? 0;
  const visits7d = visitStats?.total_visits_7d ?? 0;
  const visitsToday = visitStats?.total_visits_today ?? 0;

  const conversionRate =
    uniqueVisitors > 0
      ? ((totalRegs / uniqueVisitors) * 100).toFixed(1) + "%"
      : "—";

  return (
    <main className="min-h-screen bg-imet-cream p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-imet-navy md:text-3xl">
            Panel admin · Agentes del Cambio
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            <span className="rounded bg-imet-mint px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-imet-aqua-dark">
              {providerName}
            </span>{" "}
            · Actualizado {new Date().toLocaleString("es-MX")}
          </p>
        </div>

        {/* Stats principales */}
        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            tone="aqua"
            label="Visitas únicas"
            value={uniqueVisitors.toLocaleString("es-MX")}
            hint={`${totalVisits.toLocaleString("es-MX")} pageviews totales`}
          />
          <StatCard
            tone="navy"
            label="Pre-registros"
            value={totalRegs.toLocaleString("es-MX")}
            hint={`${byStatus.pending || 0} pendientes · ${byStatus.accepted || 0} aceptados`}
          />
          <StatCard
            label="Tasa de conversión"
            value={conversionRate}
            hint="Pre-registros / Visitas únicas"
          />
          <StatCard
            label="Hoy"
            value={`${visitsToday} / ${regsToday}`}
            hint="Visitas / Registros"
          />
        </div>

        {/* Stats últimos 7 días */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Visitas últimos 7 días"
            value={visits7d.toLocaleString("es-MX")}
          />
          <StatCard
            label="Registros últimos 7 días"
            value={regs7d.toLocaleString("es-MX")}
          />
          <StatCard
            label="En revisión"
            value={byStatus.reviewing || 0}
            hint="status = reviewing"
            tone="amber"
          />
          <StatCard
            label="Rechazados"
            value={byStatus.rejected || 0}
            hint="status = rejected"
          />
        </div>

        {/* Tabla de aplicaciones */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold text-imet-navy">
              Pre-registros recientes
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {apps.length} solicitud{apps.length === 1 ? "" : "es"} en total
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-imet-navy text-xs uppercase tracking-wider text-white/80">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Edad</th>
                <th className="px-4 py-3">Programa</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apps.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Aún no hay pre-registros.
                  </td>
                </tr>
              ) : (
                apps.map((a) => {
                  const programa =
                    a.licenciatura_escolarizada_ejecutiva ||
                    a.licenciatura_virtual ||
                    a.maestria_ejecutiva ||
                    a.maestria_virtual ||
                    "—";
                  return (
                    <tr key={a.id} className="hover:bg-imet-cream">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                        {new Date(a.created_at).toLocaleString("es-MX")}
                      </td>
                      <td className="px-4 py-3 font-medium text-imet-navy">
                        {a.full_name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{a.phone}</td>
                      <td className="px-4 py-3 text-slate-600">{a.age}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-imet-mint px-2 py-0.5 text-xs font-semibold text-imet-aqua-dark">
                          {a.program_type}
                        </span>
                        <div className="mt-1 text-xs text-slate-500">
                          {programa}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                            a.status === "accepted"
                              ? "bg-emerald-100 text-emerald-700"
                              : a.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : a.status === "reviewing"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!visitStats ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
            ⚠️ Las estadísticas de visitas no están disponibles. Asegúrate de
            haber corrido la migración{" "}
            <code className="rounded bg-amber-100 px-1">
              002_create_page_visits.sql
            </code>{" "}
            en Supabase.
          </div>
        ) : null}
      </div>
    </main>
  );
}
