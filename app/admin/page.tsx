import { getStorage } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getApplications(adminPassword: string | undefined) {
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return null;
  }
  const storage = getStorage();
  if (!storage.list) {
    return { unsupported: true as const, providerName: storage.name };
  }
  const data = await storage.list(200);
  return { data, providerName: storage.name };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const params = await searchParams;
  const result = await getApplications(params.key);

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

  const { data: apps, providerName } = result;

  return (
    <main className="min-h-screen bg-imet-cream p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-black text-imet-navy">
              Solicitudes — Agentes del Cambio
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {apps.length} solicitud{apps.length === 1 ? "" : "es"} ·{" "}
              <span className="rounded bg-imet-mint px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-imet-aqua-dark">
                {providerName}
              </span>
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
              {apps.map((a) => {
                const programa =
                  a.licenciatura_escolarizada_ejecutiva ||
                  a.licenciatura_virtual ||
                  a.maestria_ejecutiva ||
                  a.maestria_virtual ||
                  "—";
                return (
                  <tr key={a.id} className="hover:bg-imet-cream">
                    <td className="px-4 py-3 text-xs text-slate-500">
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
                      <div className="mt-1 text-xs text-slate-500">{programa}</div>
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
