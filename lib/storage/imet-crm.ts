import type {
  ApplicationInput,
  SaveResult,
  StorageAdapter,
} from "./types";

// Adapter que crea Leads en el CRM propio de iMET (https://api.imet.edu.mx/crm).
// Estrategia para esta campaña (Pepe Canto):
//   1. Token estatico (.env IMET_CRM_TOKEN) generado desde el CRM por un admin
//      via POST /api/auth/integration-token. TTL default 4 meses; cuando se
//      acerca a vencer, el admin genera uno nuevo y reemplaza el .env.
//   2. Listar asesores activos.
//   3. Listar leads de la campaña actual (filtrados server-side con ?campana=)
//      y contar cuantos tiene cada asesor.
//   4. Elegir al asesor con menor conteo (random tiebreaker) — round-robin
//      eventualmente consistente sin necesidad de estado local.
//   5. POST /api/leads con Origen=FormularioInterno, Campana="PEPE CANTO (CAMPAÑA)"
//      y un Tag homonimo para que sea visible desde dos angulos del CRM.
//   6. PUT /api/leads/{id} para volcar dirección/motivo/programa en Notas, ya
//      que CreateLeadDto no las expone.
//
// Hace 3 llamadas por submit (sin login).
//
// La campaña "PEPE CANTO (CAMPAÑA)" debe existir activa en el catalogo de
// etiquetas-origen del CRM (Admin > Campañas). Si no existe, el POST /api/leads
// fallara con 409 ConflictException — la fix es darla de alta, no aqui.

const BASE_URL =
  process.env.IMET_CRM_BASE_URL || "https://api.imet.edu.mx/crm";
const CAMPANA = "PEPE CANTO (CAMPAÑA)";

type AsesorDto = {
  id: number;
  nombre: string;
  correo: string | null;
  telefono: string | null;
  activo: boolean;
  createdAt: string;
};

type LeadDto = {
  id: number;
  asesorAsignadoId: number;
  campana: string | null;
  // Resto de campos no nos interesan para round-robin.
};

// Shape extendido que sí necesitamos para /stats (createdAt + tipoPrograma).
// Lo declaramos aparte para no inflar LeadDto del round-robin.
export type CampanaLeadStats = {
  id: number;
  createdAt: string;
  tipoPrograma: string | null;
  campana: string | null;
};

function getToken(): string {
  const token = process.env.IMET_CRM_TOKEN;
  if (!token) {
    throw new Error(
      "iMET CRM storage requiere IMET_CRM_TOKEN en .env.local. Genera uno " +
        "desde el CRM con POST /api/auth/integration-token (admin)."
    );
  }
  return token;
}

async function authedFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  // No reintentamos tras 401: el token es estatico, si vencio o se revoco,
  // la fix es regenerar uno nuevo desde el CRM y reemplazar el .env. Volvemos
  // un error explicito para que el operador sepa que hacer.
  if (res.status === 401) {
    throw new Error(
      `CRM rechazo el token (401 en ${path}). Genera uno nuevo desde ` +
        "/admin del CRM (POST /api/auth/integration-token) y actualiza " +
        "IMET_CRM_TOKEN en .env.local."
    );
  }
  return res;
}

async function listActiveAsesores(): Promise<AsesorDto[]> {
  const res = await authedFetch("/api/asesores");
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GET /api/asesores fallo (${res.status}): ${body}`);
  }
  const all = (await res.json()) as AsesorDto[];
  return all.filter((a) => a.activo);
}

async function listCampanaLeads(): Promise<LeadDto[]> {
  // El CRM acepta ?campana= para filtrar server-side por match exacto contra
  // Lead.Campana. encodeURIComponent por los parentesis y espacios. Mantenemos
  // el filter client-side defensivo: si la version desplegada del CRM todavia
  // no entiende ese query param (deploy mas viejo que esta release), ASP.NET
  // Core lo IGNORA y nos devolveria todos los leads — el .filter() abajo nos
  // protege de un round-robin sesgado en ese caso.
  const qs = `?campana=${encodeURIComponent(CAMPANA)}`;
  const res = await authedFetch(`/api/leads${qs}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GET /api/leads fallo (${res.status}): ${body}`);
  }
  const all = (await res.json()) as LeadDto[];
  return all.filter((l) => l.campana === CAMPANA);
}

function pickAsesorRoundRobin(
  asesores: AsesorDto[],
  leads: LeadDto[]
): AsesorDto {
  if (asesores.length === 0) {
    throw new Error("No hay asesores activos en el CRM para asignar el lead.");
  }

  const counts = new Map<number, number>();
  for (const a of asesores) counts.set(a.id, 0);
  for (const l of leads) {
    if (counts.has(l.asesorAsignadoId)) {
      counts.set(l.asesorAsignadoId, (counts.get(l.asesorAsignadoId) ?? 0) + 1);
    }
  }

  // Asesores con el conteo minimo. Tiebreak aleatorio para que el primer asesor
  // de la lista no se lleve siempre el primer lead cuando todos estan en cero.
  let min = Infinity;
  for (const c of counts.values()) if (c < min) min = c;
  const candidatos = asesores.filter((a) => counts.get(a.id) === min);
  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

function buildNotas(input: ApplicationInput): string {
  const programa =
    input.program_type === "licenciatura"
      ? [
          input.licenciatura_escolarizada_ejecutiva &&
            `Escolarizada/Ejecutiva: ${input.licenciatura_escolarizada_ejecutiva}`,
          input.licenciatura_virtual && `Virtual: ${input.licenciatura_virtual}`,
        ]
          .filter(Boolean)
          .join(" — ")
      : [
          input.maestria_ejecutiva && `Ejecutiva: ${input.maestria_ejecutiva}`,
          input.maestria_virtual && `Virtual: ${input.maestria_virtual}`,
        ]
          .filter(Boolean)
          .join(" — ");

  return [
    `Programa: ${programa || "(sin especificar)"}`,
    `Dirección: ${input.address}`,
    `Motivación: ${input.reason}`,
  ].join("\n\n");
}

type CreateLeadResponse = { id: number };

async function createLead(input: ApplicationInput, asesorId: number) {
  const tipoPrograma =
    input.program_type === "licenciatura" ? "Licenciatura" : "Maestria";

  const res = await authedFetch("/api/leads", {
    method: "POST",
    body: JSON.stringify({
      nombreCompleto: input.full_name,
      telefono: input.phone,
      correo: null,
      edad: input.age,
      asesorAsignadoId: asesorId,
      tipoPrograma,
      programaExternoId: null,
      origen: "FormularioInterno",
      campana: CAMPANA,
      subEstado: null,
      tags: [CAMPANA],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`POST /api/leads fallo (${res.status}): ${body}`);
  }
  return (await res.json()) as CreateLeadResponse;
}

async function patchLeadNotas(leadId: number, notas: string) {
  // CreateLeadDto no expone Notas; lo seteamos en un PUT posterior. Si falla,
  // no abortamos: el lead ya quedo creado y solo perdemos la nota libre.
  const res = await authedFetch(`/api/leads/${leadId}`, {
    method: "PUT",
    body: JSON.stringify({
      tipoPrograma: null,
      programaExternoId: null,
      campana: CAMPANA,
      notas,
      motivoPerdida: null,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn(
      `[imet-crm] PUT /api/leads/${leadId} fallo (${res.status}): ${body}`
    );
  }
}

/**
 * Devuelve los leads de la campaña con los campos necesarios para /stats:
 * id, createdAt, tipoPrograma. Reusa el mismo filtro client-side defensivo
 * que listCampanaLeads. Pensado para conteo público — el caller NO debe
 * exponer los leads completos, solo los conteos derivados.
 */
export async function listCampanaLeadsForStats(): Promise<CampanaLeadStats[]> {
  const qs = `?campana=${encodeURIComponent(CAMPANA)}`;
  const res = await authedFetch(`/api/leads${qs}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GET /api/leads fallo (${res.status}): ${body}`);
  }
  const all = (await res.json()) as CampanaLeadStats[];
  return all.filter((l) => l.campana === CAMPANA);
}

export const imetCrmAdapter: StorageAdapter = {
  name: "imet-crm",

  async save(input: ApplicationInput): Promise<SaveResult> {
    const [asesores, leads] = await Promise.all([
      listActiveAsesores(),
      listCampanaLeads(),
    ]);

    const asesor = pickAsesorRoundRobin(asesores, leads);
    const created = await createLead(input, asesor.id);

    await patchLeadNotas(created.id, buildNotas(input));

    return {
      id: String(created.id),
      created_at: new Date().toISOString(),
    };
  },
};
