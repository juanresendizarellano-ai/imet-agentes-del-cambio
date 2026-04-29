import type {
  ApplicationInput,
  SaveResult,
  StorageAdapter,
} from "./types";

/**
 * Adapter genérico para CRMs vía webhook (HubSpot, Zapier, Make, n8n, etc.).
 *
 * Hace POST con el payload completo a `CRM_WEBHOOK_URL`.
 * Si el CRM requiere auth, pásala en `CRM_WEBHOOK_AUTH_HEADER`
 * (formato libre: `Bearer xxx`, `Basic xxx`, etc.).
 *
 * Espera que el endpoint devuelva JSON con al menos `{ id }` —
 * si tu CRM responde distinto, ajusta el parser abajo.
 */
export const webhookAdapter: StorageAdapter = {
  name: "webhook",

  async save(input: ApplicationInput): Promise<SaveResult> {
    const url = process.env.CRM_WEBHOOK_URL;
    if (!url) {
      throw new Error("Webhook storage requiere CRM_WEBHOOK_URL en .env.local");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const auth = process.env.CRM_WEBHOOK_AUTH_HEADER;
    if (auth) headers["Authorization"] = auth;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...input,
        submitted_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[webhook] CRM respondió", res.status, body);
      throw new Error("El CRM rechazó la solicitud");
    }

    const body = (await res.json().catch(() => ({}))) as {
      id?: string;
      created_at?: string;
    };

    return {
      id: body.id ?? crypto.randomUUID(),
      created_at: body.created_at ?? new Date().toISOString(),
    };
  },
};
