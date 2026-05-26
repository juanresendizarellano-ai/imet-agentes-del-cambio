import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  ApplicationInput,
  ApplicationRecord,
  SaveResult,
  StorageAdapter,
  VisitInput,
  VisitStats,
} from "./types";

let cachedClient: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase storage requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local"
    );
  }

  cachedClient = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  return cachedClient;
}

export type LeadInput = {
  full_name: string;
  phone: string;
  age: number;
  program_type: "licenciatura" | "maestria";
  ip_address: string | null;
  user_agent: string | null;
  source?: string;
};

export type LeadUpdate = {
  crm_lead_id?: string | null;
  crm_push_status?: "success" | "failed";
  crm_push_error?: string | null;
};

/**
 * Guarda un lead capturado por el mini-form del hero. Independiente del
 * adapter activo: este flujo siempre escribe a Supabase para tener un control
 * de campana propio (visitas vs leads vs aplicaciones completas).
 */
export async function saveLeadToSupabase(input: LeadInput): Promise<{ id: string; created_at: string }> {
  const client = getClient();
  const { data, error } = await client
    .from("leads")
    .insert(input)
    .select("id, created_at")
    .single();
  if (error) {
    console.error("[supabase] insert lead error:", error);
    throw new Error("No se pudo guardar el lead en Supabase");
  }
  return { id: data.id, created_at: data.created_at };
}

export async function updateLeadInSupabase(id: string, patch: LeadUpdate): Promise<void> {
  const client = getClient();
  const { error } = await client.from("leads").update(patch).eq("id", id);
  if (error) {
    console.error("[supabase] update lead error:", error);
    // No tirar: la actualizacion del estado CRM es best-effort.
  }
}

export type PreRegisterInput = {
  full_name: string;
  phone: string;
  ip_address: string | null;
  user_agent: string | null;
  source?: string;
};

export type PreRegisterRecord = {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
};

/**
 * Lookup de un preregistro por id. Usado para reconocer a un visitante
 * cuando llega con ?p=<id> en el URL (links compartidos por el equipo).
 * Devuelve null si no existe — no tira para no exponer si un id es válido.
 */
export async function getPreRegisterById(
  id: string
): Promise<PreRegisterRecord | null> {
  const client = getClient();
  const { data, error } = await client
    .from("preregistrations")
    .select("id, full_name, phone, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[supabase] lookup preregistration error:", error);
    return null;
  }
  return data as PreRegisterRecord | null;
}

/**
 * Guarda un preregistro (gate de acceso a la landing).
 * Es el primer touchpoint identificado del visitante — solo nombre + whatsapp.
 * Funnel: preregistrations -> leads -> applications.
 */
export async function savePreRegisterToSupabase(
  input: PreRegisterInput
): Promise<{ id: string; created_at: string }> {
  const client = getClient();
  const { data, error } = await client
    .from("preregistrations")
    .insert(input)
    .select("id, created_at")
    .single();
  if (error) {
    console.error("[supabase] insert preregistration error:", error);
    throw new Error("No se pudo guardar el preregistro en Supabase");
  }
  return { id: data.id, created_at: data.created_at };
}

export const supabaseAdapter: StorageAdapter = {
  name: "supabase",

  async save(input: ApplicationInput): Promise<SaveResult> {
    const client = getClient();
    const { data, error } = await client
      .from("applications")
      .insert(input)
      .select("id, created_at")
      .single();

    if (error) {
      console.error("[supabase] insert error:", error);
      throw new Error("No se pudo guardar la solicitud en Supabase");
    }
    return { id: data.id, created_at: data.created_at };
  },

  async list(limit = 200): Promise<ApplicationRecord[]> {
    const client = getClient();
    const { data, error } = await client
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as ApplicationRecord[];
  },

  async logVisit(input: VisitInput): Promise<void> {
    const client = getClient();
    const { error } = await client.from("page_visits").insert(input);
    if (error) {
      console.error("[supabase] logVisit error:", error);
      // No tirar — el logging es fire-and-forget, no debe romper UX
    }
  },

  async visitStats(): Promise<VisitStats> {
    const client = getClient();
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalRes, todayRes, sevenDayRes, allVisits] = await Promise.all([
      client.from("page_visits").select("*", { count: "exact", head: true }),
      client
        .from("page_visits")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfToday.toISOString()),
      client
        .from("page_visits")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString()),
      client.from("page_visits").select("visitor_id"),
    ]);

    const uniqueIds = new Set(
      (allVisits.data ?? [])
        .map((v: { visitor_id: string | null }) => v.visitor_id)
        .filter(Boolean)
    );

    return {
      total_visits: totalRes.count ?? 0,
      unique_visitors: uniqueIds.size,
      total_visits_7d: sevenDayRes.count ?? 0,
      total_visits_today: todayRes.count ?? 0,
    };
  },
};
