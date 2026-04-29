import type { StorageAdapter } from "./types";
import { supabaseAdapter } from "./supabase";
import { webhookAdapter } from "./webhook";

const ADAPTERS: Record<string, StorageAdapter> = {
  supabase: supabaseAdapter,
  webhook: webhookAdapter,
  // Para agregar un nuevo provider (HubSpot directo, Salesforce, Sheets, etc.):
  //   1. Crea lib/storage/<nombre>.ts con un objeto que cumpla StorageAdapter
  //   2. Impórtalo aquí y agrégalo al objeto ADAPTERS
  //   3. Setea STORAGE_PROVIDER=<nombre> en .env.local
};

export function getStorage(): StorageAdapter {
  const name = (process.env.STORAGE_PROVIDER || "supabase").toLowerCase();
  const adapter = ADAPTERS[name];
  if (!adapter) {
    throw new Error(
      `STORAGE_PROVIDER desconocido: "${name}". Opciones: ${Object.keys(ADAPTERS).join(", ")}`
    );
  }
  return adapter;
}

export type { ApplicationInput, ApplicationRecord, SaveResult, StorageAdapter } from "./types";
