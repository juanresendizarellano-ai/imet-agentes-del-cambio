"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import {
  LICENCIATURAS_ESCOLARIZADA_EJECUTIVA,
  LICENCIATURAS_VIRTUAL,
  MAESTRIAS_EJECUTIVA,
  MAESTRIAS_VIRTUAL,
} from "@/lib/programs";

type ProgramType = "" | "licenciatura" | "maestria";

type FormState = {
  full_name: string;
  phone: string;
  age: string;
  address: string;
  reason: string;
  program_type: ProgramType;
  licenciatura_escolarizada_ejecutiva: string;
  licenciatura_virtual: string;
  maestria_ejecutiva: string;
  maestria_virtual: string;
};

const initialState: FormState = {
  full_name: "",
  phone: "",
  age: "",
  address: "",
  reason: "",
  program_type: "",
  licenciatura_escolarizada_ejecutiva: "",
  licenciatura_virtual: "",
  maestria_ejecutiva: "",
  maestria_virtual: "",
};

export default function ApplicationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const update =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value as FormState[K] }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: parseInt(form.age, 10),
          licenciatura_escolarizada_ejecutiva:
            form.program_type === "licenciatura"
              ? form.licenciatura_escolarizada_ejecutiva || null
              : null,
          licenciatura_virtual:
            form.program_type === "licenciatura"
              ? form.licenciatura_virtual || null
              : null,
          maestria_ejecutiva:
            form.program_type === "maestria"
              ? form.maestria_ejecutiva || null
              : null,
          maestria_virtual:
            form.program_type === "maestria"
              ? form.maestria_virtual || null
              : null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "No se pudo enviar la solicitud");
      }

      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (status === "success") {
    return (
      <section
        id="aplicar"
        className="section bg-gradient-to-br from-imet-mint via-white to-imet-mint"
      >
        <div className="container-tight">
          <div className="mx-auto max-w-2xl rounded-3xl border border-imet-aqua/20 bg-white p-12 text-center shadow-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-imet-mint">
              <CheckCircle2 className="h-8 w-8 text-imet-aqua-dark" />
            </div>
            <h2 className="heading-md mb-4">¡Solicitud recibida!</h2>
            <p className="mb-6 text-base leading-relaxed text-slate-600">
              Gracias por aplicar al programa{" "}
              <strong className="text-imet-navy">Agentes del Cambio</strong>.
              Tu solicitud entró a la fase de evaluación del comité
              seleccionador. Te contactaremos al teléfono que registraste con la
              resolución de tu candidatura.
            </p>
            <div className="rounded-xl bg-imet-cream p-5 text-left">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-imet-aqua-dark">
                Próximos pasos
              </div>
              <ol className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="font-bold text-imet-aqua-dark">1.</span>
                  Evaluación del comité (1-2 semanas).
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-imet-aqua-dark">2.</span>
                  Posible entrevista breve para conocerte mejor.
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-imet-aqua-dark">3.</span>
                  Resultado final por teléfono y correo.
                </li>
              </ol>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm font-semibold text-imet-aqua-dark hover:underline"
            >
              Enviar otra solicitud
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="aplicar" className="section bg-imet-cream">
      <div className="container-tight">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-4">Formulario de registro</div>
            <h2 className="heading-lg mb-4">Aplica a tu beca ahora</h2>
            <p className="lead">
              Completa el formulario y comienza tu camino en iMET con el
              respaldo del programa Agentes del Cambio.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-7 md:p-10"
          >
            {/* Sección 1: Datos personales */}
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-aqua-gradient text-xs font-bold text-white">
                1
              </div>
              <h3 className="text-lg font-bold text-imet-navy">
                Tus datos personales
              </h3>
            </div>
            <p className="mb-6 ml-10 text-sm text-slate-500">
              Información básica para contactarte con tu resultado.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nombre completo" required>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={form.full_name}
                  onChange={update("full_name")}
                  className={inputClasses}
                  placeholder="Ej. María Pérez Canul"
                />
              </Field>

              <Field label="Número telefónico" required>
                <input
                  type="tel"
                  required
                  pattern="[0-9\s+()-]{10,}"
                  value={form.phone}
                  onChange={update("phone")}
                  className={inputClasses}
                  placeholder="999 123 4567"
                />
              </Field>

              <Field label="Edad" required>
                <input
                  type="number"
                  required
                  min={15}
                  max={99}
                  value={form.age}
                  onChange={update("age")}
                  className={inputClasses}
                  placeholder="25"
                />
              </Field>

              <Field label="Dirección" required>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={update("address")}
                  className={inputClasses}
                  placeholder="Colonia y municipio"
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Razón por la que aplicas a este programa" required>
                <textarea
                  required
                  rows={4}
                  minLength={20}
                  value={form.reason}
                  onChange={update("reason")}
                  className={`${inputClasses} resize-none`}
                  placeholder="Cuéntanos qué te motiva, qué quieres lograr y por qué este programa es importante para ti."
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Programa de interés" required>
                <select
                  required
                  value={form.program_type}
                  onChange={update("program_type")}
                  className={inputClasses}
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  <option value="licenciatura">Licenciatura</option>
                  <option value="maestria">Maestría</option>
                </select>
              </Field>
            </div>

            {/* Sección 2: Licenciatura */}
            {form.program_type === "licenciatura" && (
              <div className="mt-10 animate-fade-in border-t border-slate-100 pt-8">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-aqua-gradient text-xs font-bold text-white">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-imet-navy">
                    Elige tu licenciatura
                  </h3>
                </div>
                <p className="mb-6 ml-10 text-sm text-slate-500">
                  Selecciona la licenciatura y modalidad. Si la opción no está
                  disponible en una modalidad, elige <strong>N/A</strong>.
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Modalidad escolarizada o ejecutiva">
                    <select
                      value={form.licenciatura_escolarizada_ejecutiva}
                      onChange={update("licenciatura_escolarizada_ejecutiva")}
                      className={inputClasses}
                    >
                      <option value="">Selecciona</option>
                      {LICENCIATURAS_ESCOLARIZADA_EJECUTIVA.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Modalidad virtual">
                    <select
                      value={form.licenciatura_virtual}
                      onChange={update("licenciatura_virtual")}
                      className={inputClasses}
                    >
                      <option value="">Selecciona</option>
                      {LICENCIATURAS_VIRTUAL.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {/* Sección 3: Maestría */}
            {form.program_type === "maestria" && (
              <div className="mt-10 animate-fade-in border-t border-slate-100 pt-8">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-aqua-gradient text-xs font-bold text-white">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-imet-navy">
                    Elige tu maestría
                  </h3>
                </div>
                <p className="mb-6 ml-10 text-sm text-slate-500">
                  Selecciona la maestría y modalidad. Si la opción no está
                  disponible en una modalidad, elige <strong>N/A</strong>.
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Modalidad ejecutiva">
                    <select
                      value={form.maestria_ejecutiva}
                      onChange={update("maestria_ejecutiva")}
                      className={inputClasses}
                    >
                      <option value="">Selecciona</option>
                      {MAESTRIAS_EJECUTIVA.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Modalidad virtual">
                    <select
                      value={form.maestria_virtual}
                      onChange={update("maestria_virtual")}
                      className={inputClasses}
                    >
                      <option value="">Selecciona</option>
                      {MAESTRIAS_VIRTUAL.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <strong>No pudimos enviar tu solicitud.</strong>
                  <div className="mt-1 text-xs">{errorMsg}</div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="mt-8 flex flex-col items-center gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
              <p className="text-xs text-slate-500">
                Al enviar, aceptas que iMET y el equipo del Dip. Pepe Canto te
                contacten con la resolución.
              </p>
              <button
                type="submit"
                disabled={status === "submitting" || !form.program_type}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar solicitud
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-imet-navy placeholder:text-slate-400 transition focus:border-imet-aqua focus:outline-none focus:ring-2 focus:ring-imet-aqua/20";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold text-imet-navy">
        {label}
        {required && <span className="ml-0.5 text-imet-aqua-dark">*</span>}
      </div>
      {children}
    </label>
  );
}
