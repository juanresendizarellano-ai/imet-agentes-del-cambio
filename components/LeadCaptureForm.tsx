"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

type ProgramType = "" | "licenciatura" | "maestria";

type FormState = {
  full_name: string;
  phone: string;
  age: string;
  program_type: ProgramType;
};

const initialState: FormState = {
  full_name: "",
  phone: "",
  age: "",
  program_type: "",
};

export default function LeadCaptureForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update =
    <K extends keyof FormState>(key: K) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value as FormState[K] }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          age: parseInt(form.age, 10),
          program_type: form.program_type,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "No se pudo enviar el registro");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (status === "success") {
    return (
      <div className="relative animate-slide-up-in overflow-hidden rounded-3xl border-2 border-imet-aqua/30 bg-white p-6 shadow-2xl shadow-imet-aqua/30 sm:p-7">
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-imet-mint blur-3xl" />
        <div className="relative">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-imet-mint">
            <CheckCircle2 className="h-6 w-6 text-imet-aqua-dark" />
          </div>
          <h3 className="mb-2 text-xl font-black text-imet-navy">
            ¡Registro recibido!
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            Un asesor del programa{" "}
            <strong className="text-imet-navy">Agentes del Cambio</strong> te
            contactará por WhatsApp en las próximas 48 horas.
          </p>
          <div className="mb-5 rounded-xl bg-imet-cream p-4 text-left text-xs leading-relaxed text-slate-600">
            <strong className="text-imet-aqua-dark">Mientras tanto:</strong>{" "}
            completa tu aplicación oficial abajo para acelerar tu proceso y
            asegurar tu lugar.
          </div>
          <a
            href="#aplicar"
            className="btn-primary w-full justify-center"
          >
            Completar aplicación oficial
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative animate-slide-up-in overflow-hidden rounded-3xl border border-imet-aqua/20 bg-white p-5 shadow-2xl shadow-imet-aqua/20 sm:p-6"
    >
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-imet-mint blur-2xl" />

      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-imet-mint px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-imet-aqua-dark">
          <Sparkles className="h-3 w-3" />
          Reserva tu lugar
        </div>
        <h3 className="mb-1 text-lg font-black leading-tight text-imet-navy sm:text-xl">
          Apunta a tu beca del 50%
        </h3>
        <p className="mb-5 text-xs text-slate-500 sm:text-sm">
          Déjanos tus datos y un asesor te contacta en 48 hrs.
        </p>

        <div className="space-y-3">
          <input
            type="text"
            required
            minLength={3}
            value={form.full_name}
            onChange={update("full_name")}
            className={inputClasses}
            placeholder="Nombre completo"
            autoComplete="name"
          />

          <input
            type="tel"
            required
            pattern="[0-9\s+()-]{10,}"
            value={form.phone}
            onChange={update("phone")}
            className={inputClasses}
            placeholder="WhatsApp (999 123 4567)"
            autoComplete="tel"
            inputMode="tel"
          />

          <div className="grid grid-cols-[1fr,1.5fr] gap-3">
            <input
              type="number"
              required
              min={15}
              max={99}
              value={form.age}
              onChange={update("age")}
              className={inputClasses}
              placeholder="Edad"
              inputMode="numeric"
            />

            <select
              required
              value={form.program_type}
              onChange={update("program_type")}
              className={`${inputClasses} ${
                form.program_type === "" ? "text-slate-400" : "text-imet-navy"
              }`}
            >
              <option value="" disabled>
                ¿Qué te interesa?
              </option>
              <option value="licenciatura">Licenciatura</option>
              <option value="maestria">Maestría</option>
            </select>
          </div>
        </div>

        {status === "error" && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary-hero mt-5 w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Quiero mi beca del 50%
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </>
          )}
        </button>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-medium text-slate-500">
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-imet-aqua-dark" />
            <span>Sin examen</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-imet-aqua-dark" />
            <span>Respuesta 48 hrs</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-imet-aqua-dark" />
            <span>100% gratis</span>
          </div>
        </div>
      </div>
    </form>
  );
}

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-imet-navy placeholder:text-slate-400 transition focus:border-imet-aqua focus:outline-none focus:ring-2 focus:ring-imet-aqua/20";
