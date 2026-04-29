# iMET Agentes del Cambio — Landing + Formulario

Landing page del programa de beca **Agentes del Cambio** de iMET, en coordinación con el equipo del Dip. Pepe Canto Tamayo. Incluye formulario de aplicación y backend pluggable (Supabase hoy, CRM mañana).

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS con paleta verde/aqua iMET
- Storage adapter pattern: `supabase`, `webhook` (CRM)
- Lucide para iconos

## Setup local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar storage (Supabase)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el SQL Editor, ejecuta el contenido de [`supabase/migrations/001_create_applications.sql`](./supabase/migrations/001_create_applications.sql).
3. Copia las claves del panel **Settings → API**.

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y rellena las llaves de Supabase + `ADMIN_PASSWORD`.

### 4. Reemplazar logos placeholder

Los archivos `public/imet-logo.svg` y `public/pepe-canto-logo.svg` son **placeholders provisionales**. Reemplázalos por los logos oficiales:

```
public/imet-logo.svg          ← logo iMET (recomendado: PNG 192×192 o SVG)
public/pepe-canto-logo.svg    ← logo "PEPE CANTO TAMAYO • AGENTES DEL CAMBIO"
```

Si usas PNG, renombra los archivos a `.png` y actualiza las referencias en:
- [`components/Header.tsx`](./components/Header.tsx) (línea con `src="/imet-logo.svg"`)
- [`components/Hero.tsx`](./components/Hero.tsx) (línea con `src="/pepe-canto-logo.svg"`)
- [`components/Footer.tsx`](./components/Footer.tsx) (línea con `src="/imet-logo.svg"`)

### 5. Correr localmente

```bash
npm run dev
```

Abre [http://localhost:3030](http://localhost:3030).

Panel admin: [http://localhost:3030/admin?key=tu-clave](http://localhost:3030/admin?key=tu-clave)

---

## Migración a CRM (cuando quieras dejar Supabase)

La aplicación está construida con un **storage adapter pattern**: la API no sabe qué backend está atrás. Cambiar de Supabase a un CRM se hace en **3 pasos sin tocar componentes ni rutas**.

### Caso A: tu CRM acepta webhooks (HubSpot Forms API, Zapier, Make, n8n, Pipedrive, etc.)

Ya está implementado. Solo cambia variables de entorno:

```env
STORAGE_PROVIDER=webhook
CRM_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxx/yyy
CRM_WEBHOOK_AUTH_HEADER=Bearer tu-token        # opcional
```

El payload que se envía al webhook tiene esta forma:

```json
{
  "full_name": "María Pérez",
  "phone": "9991234567",
  "age": 25,
  "address": "Mérida, Yuc.",
  "reason": "...",
  "program_type": "licenciatura",
  "licenciatura_escolarizada_ejecutiva": null,
  "licenciatura_virtual": "Educación",
  "maestria_ejecutiva": null,
  "maestria_virtual": null,
  "ip_address": "...",
  "user_agent": "...",
  "source": "landing-pepe-canto",
  "submitted_at": "2026-04-29T13:48:00.000Z"
}
```

En tu CRM, mapea estos campos a los del lead. Si tu CRM responde con `{ id }`, lo usamos; si no, generamos un UUID local.

### Caso B: tu CRM tiene SDK propio (HubSpot SDK, Salesforce, Zoho, etc.)

Crea un nuevo adapter en 3 pasos:

**1.** Crea `lib/storage/<crm-name>.ts`:

```ts
import type { ApplicationInput, SaveResult, StorageAdapter } from "./types";

export const hubspotAdapter: StorageAdapter = {
  name: "hubspot",
  async save(input: ApplicationInput): Promise<SaveResult> {
    // Tu lógica con el SDK del CRM:
    // const client = new HubspotClient({ accessToken: process.env.HUBSPOT_TOKEN });
    // const contact = await client.crm.contacts.basicApi.create({
    //   properties: { firstname: input.full_name, phone: input.phone, ... }
    // });
    // return { id: contact.id, created_at: new Date().toISOString() };
  },
};
```

**2.** Regístralo en [`lib/storage/index.ts`](./lib/storage/index.ts):

```ts
import { hubspotAdapter } from "./hubspot";

const ADAPTERS: Record<string, StorageAdapter> = {
  supabase: supabaseAdapter,
  webhook: webhookAdapter,
  hubspot: hubspotAdapter,   // ← agregar
};
```

**3.** Activa el provider:

```env
STORAGE_PROVIDER=hubspot
HUBSPOT_TOKEN=...
```

**Listo.** No tocas componentes, no tocas la ruta API, no tocas validaciones. La interfaz `StorageAdapter` te obliga a implementar `save()` y opcionalmente `list()` (para el panel admin).

### Operación dual durante la migración

¿Quieres mandar leads tanto a Supabase como al CRM en paralelo durante el cambio? Crea un adapter `dual`:

```ts
// lib/storage/dual.ts
export const dualAdapter: StorageAdapter = {
  name: "dual",
  async save(input) {
    const [primary] = await Promise.allSettled([
      supabaseAdapter.save(input),   // backup
      webhookAdapter.save(input),    // CRM nuevo
    ]);
    if (primary.status === "fulfilled") return primary.value;
    throw new Error("Ambos providers fallaron");
  },
};
```

Y registra `dual` en `index.ts`. Útil para validar que el CRM recibe bien antes de apagar Supabase.

---

## Estructura

```
app/
  page.tsx                       # Landing
  layout.tsx                     # Layout raíz + metadata
  globals.css                    # Estilos globales + Tailwind
  api/applications/route.ts      # POST endpoint del formulario
  admin/page.tsx                 # Panel para ver solicitudes
components/
  Header.tsx, Hero.tsx, AboutProgram.tsx,
  Benefits.tsx, Comparison.tsx, Stages.tsx,
  Programs.tsx, ApplicationForm.tsx, Footer.tsx
lib/
  programs.ts                    # Listas de programas validadas
  storage/
    types.ts                     # Contrato StorageAdapter
    index.ts                     # Selector por env var
    supabase.ts                  # Implementación Supabase
    webhook.ts                   # Implementación CRM genérico
public/
  imet-logo.svg                  # Placeholder (reemplazar)
  pepe-canto-logo.svg            # Placeholder (reemplazar)
supabase/migrations/
  001_create_applications.sql    # Schema con RLS y validaciones
```

## Modelo de datos

Tabla `applications`:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK, auto |
| `created_at` | timestamptz | auto |
| `full_name` | text | obligatorio |
| `phone` | text | obligatorio |
| `age` | int | 15-99 |
| `address` | text | obligatorio |
| `reason` | text | min 20 caracteres |
| `program_type` | text | `licenciatura` o `maestria` |
| `licenciatura_escolarizada_ejecutiva` | text | enum |
| `licenciatura_virtual` | text | enum |
| `maestria_ejecutiva` | text | enum |
| `maestria_virtual` | text | enum |
| `status` | text | `pending`/`reviewing`/`accepted`/`rejected` |
| `reviewer_notes` | text | uso interno |
| `ip_address`, `user_agent`, `source` | text | metadata |

## Seguridad

- **RLS habilitado** en Supabase. Política de INSERT pública (cualquiera puede aplicar).
- **No hay política de SELECT pública**: solo se accede a las filas usando la `service_role` key (server-side).
- El panel `/admin` está protegido por `ADMIN_PASSWORD` por query string. Para producción seria, reemplaza por auth real (Supabase Auth, Clerk, NextAuth).

## Deploy a Vercel

1. Push a un repo de GitHub.
2. Importa el proyecto en [vercel.com](https://vercel.com).
3. Agrega las variables de entorno de tu provider activo en **Project Settings → Environment Variables**.
4. Deploy.

Para conectar dominio propio (`agentes.imet.edu.mx` o similar), configura DNS desde el panel de Vercel.

## Customización

- **Paleta**: edita `tailwind.config.ts` (sección `imet`).
- **Programas/modalidades**: edita `lib/programs.ts` y la migración SQL (mantener sincronizadas).
- **Texto de la landing**: cada sección está en su propio componente en `components/`.
