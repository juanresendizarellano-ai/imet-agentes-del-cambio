import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  ApplicationInput,
  ApplicationRecord,
  SaveResult,
  StorageAdapter,
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
};
