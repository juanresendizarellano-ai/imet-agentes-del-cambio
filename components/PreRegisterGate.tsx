"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Loader2,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const STORAGE_KEY = "imet_preregister";

type StoredPreRegister = {
  full_name: string;
  phone: string;
  at: string;
  // id que devuelve Supabase. Lo usamos despues para enlazar este preregistro
  // con el lead/aplicacion del mismo visitante.
  preregister_id?: string;
};

function readStored(): StoredPreRegister | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredPreRegister;
  } catch {
    return null;
  }
}

export default function PreRegisterGate() {
  // mounted: evita flash del modal en SSR/hydration
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setMounted(true);

      // 1. Fast path: ya hay localStorage → no abrimos el gate
      const existing = readStored();
      if (existing) return;

      // 2. URL recognition: ?p=<uuid> en el URL → lookup en Supabase para
      //    reconocer al visitante cross-device cuando le compartimos un link
      const url = new URL(window.location.href);
      const refId = url.searchParams.get("p");
      if (refId) {
        try {
          const res = await fetch(
            `/api/preregister?id=${encodeURIComponent(refId)}`,
            { cache: "no-store" }
          );
          if (res.ok) {
            const body = (await res.json()) as {
              record?: {
                id: string;
                full_name: string;
                phone: string;
              } | null;
            };
            const rec = body.record;
            if (rec && rec.full_name && rec.phone) {
              if (cancelled) return;
              // Match: persistimos en localStorage para futuras visitas en
              // este mismo navegador
              try {
                const stored: StoredPreRegister = {
                  full_name: rec.full_name,
                  phone: rec.phone,
                  at: new Date().toISOString(),
                  preregister_id: rec.id,
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
              } catch {
                // si localStorage falla, igual no abrimos el gate — ya
                // confirmamos identidad contra Supabase
              }
              return; // NO abrir el gate
            }
          }
        } catch {
          // si el lookup falla por red, caemos al flujo normal de gate
        }
      }

      // 3. Fallback: nada nos identifica → abrimos el gate
      if (!cancelled) setOpen(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Bloquea el scroll del body mientras el gate está abierto
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mounted, open]);

  if (!mounted || !open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (cleanName.length < 3) {
      setStatus("error");
      setErrorMsg("Ingresa tu nombre completo");
      return;
    }
    // Cuenta sólo dígitos para validar — el usuario puede escribir con espacios o guiones
    const digitsOnly = cleanPhone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setStatus("error");
      setErrorMsg("WhatsApp inválido (mínimo 10 dígitos)");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/preregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: cleanName, phone: cleanPhone }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "No se pudo guardar tu preregistro");
      }

      const { id } = (await res.json()) as { id?: string };

      const payload: StoredPreRegister = {
        full_name: cleanName,
        phone: cleanPhone,
        at: new Date().toISOString(),
        preregister_id: id,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // si localStorage falla igual dejamos pasar, ya quedo en Supabase
      }

      // pequeña pausa para que se vea el feedback antes de cerrar
      setTimeout(() => setOpen(false), 250);
    } catch (err) {
      // Si falla la red NO cerramos el gate: el dato no quedó en backend.
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Error de red, intenta de nuevo"
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prereg-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-imet-navy/70 px-4 py-6 backdrop-blur-md animate-fade-in-up"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-imet-aqua/20 bg-white p-6 shadow-2xl shadow-imet-navy/40 sm:p-7">
        <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-imet-mint blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-imet-aqua/15 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-imet-mint px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-imet-aqua-dark">
            <Lock className="h-3 w-3" />
            Acceso al programa
          </div>

          <h2
            id="prereg-title"
            className="mb-2 text-2xl font-black leading-tight text-imet-navy sm:text-3xl"
          >
            Antes de continuar, preséntate
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-slate-600">
            Esta página contiene información sobre la beca del{" "}
            <strong className="text-imet-navy">50% en colegiaturas</strong> del
            programa <strong className="text-imet-navy">Agentes del Cambio</strong>.
            Déjanos tu nombre y WhatsApp y te damos acceso completo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              required
              minLength={3}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClasses}
              placeholder="Nombre completo"
              autoComplete="name"
              autoFocus
            />

            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses}
              placeholder="WhatsApp (999 123 4567)"
              autoComplete="tel"
              inputMode="tel"
            />

            {status === "error" && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary-hero mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Dándote acceso...
                </>
              ) : (
                <>
                  Acceder al programa
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] font-medium text-slate-500">
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-imet-aqua-dark" />
              <span>100% gratis</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-imet-aqua-dark" />
              <span>Sin compromiso</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-imet-aqua-dark" />
              <span>Beca 50%</span>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] leading-relaxed text-slate-400">
            Al continuar aceptas que el equipo del Dip. Pepe Canto e iMET te
            contacte por WhatsApp con información del programa.
          </p>
        </div>
      </div>
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-imet-navy placeholder:text-slate-400 transition focus:border-imet-aqua focus:outline-none focus:ring-2 focus:ring-imet-aqua/20";
