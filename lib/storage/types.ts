/**
 * Contrato genérico para almacenar solicitudes de beca.
 *
 * Cualquier backend (Supabase, CRM HubSpot, Salesforce, webhook, Sheets, etc.)
 * debe implementar esta interfaz. La capa de aplicación (`/api/applications`)
 * NO sabe ni le importa qué backend está atrás.
 *
 * Para agregar un nuevo provider:
 *   1. Crea `lib/storage/<provider>.ts` que exporte un `StorageAdapter`.
 *   2. Regístralo en `lib/storage/index.ts` bajo su nombre.
 *   3. Apunta `STORAGE_PROVIDER=<nombre>` en `.env.local`.
 */

export type ApplicationInput = {
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
  ip_address: string | null;
  user_agent: string | null;
  source: string;
};

export type ApplicationRecord = ApplicationInput & {
  id: string;
  created_at: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
};

export type SaveResult = {
  id: string;
  created_at: string;
};

export type VisitInput = {
  path: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  visitor_id: string | null;
};

export type VisitStats = {
  total_visits: number;
  unique_visitors: number;
  total_visits_7d: number;
  total_visits_today: number;
};

export interface StorageAdapter {
  /** Nombre del provider — útil para logs y debugging. */
  readonly name: string;

  /** Guarda una solicitud y devuelve id + timestamp. */
  save(input: ApplicationInput): Promise<SaveResult>;

  /**
   * Lista solicitudes para el panel admin. Opcional: si el CRM no soporta
   * lectura desde la app (porque las leads viven solo en el CRM), devuelve
   * un arreglo vacío y el admin se redirige al CRM directamente.
   */
  list?(limit?: number): Promise<ApplicationRecord[]>;

  /** Loguea una visita a la landing. Opcional. */
  logVisit?(input: VisitInput): Promise<void>;

  /** Devuelve estadísticas de visitas para el panel admin. Opcional. */
  visitStats?(): Promise<VisitStats>;
}
