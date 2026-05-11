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
