"use client";

import { useState } from "react";
import {
  ClipboardList,
  Users2,
  Trophy,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

const stages = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Registro",
    timing: "Hoy mismo",
    description:
      "Completa el formulario de aplicación con tus datos personales, programa de interés y la razón por la que aplicas. Toma menos de 5 minutos.",
    bullets: [
      "Datos personales y contacto",
      "Programa y modalidad de interés",
      "Razón por la que aplicas",
    ],
  },
  {
    number: "02",
    icon: Users2,
    title: "Evaluación del comité",
    timing: "1 a 2 semanas",
    description:
      "El comité evaluador del programa revisa tu solicitud y evalúa tu candidatura para definir si cumples con el perfil que busca Agentes del Cambio.",
    bullets: [
      "Revisión de solicitud",
      "Validación de perfil y compromiso",
      "Posible entrevista breve",
    ],
  },
  {
    number: "03",
    icon: Trophy,
    title: "Resultado de la candidatura",
    timing: "Notificación directa",
    description:
      "Te contactamos con la resolución. Si eres seleccionado, comienzas tu proceso de inscripción gratuita y arrancas tu carrera con el 50% de beca.",
    bullets: [
      "Notificación por teléfono y correo",
      "Inscripción gratuita inmediata",
      "Bienvenida a iMET Academy",
    ],
  },
];

function StageCard({
  number,
  icon: Icon,
  title,
  timing,
  description,
  bullets,
}: {
  number: string;
  icon: LucideIcon;
  title: string;
  timing: string;
  description: string;
  bullets: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition hover:border-imet-aqua-light/40 hover:bg-white/[0.06]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-5 text-left md:cursor-default md:block md:p-7"
      >
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-imet-aqua text-white shadow-lg shadow-imet-aqua/40 md:h-12 md:w-12">
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 md:mt-5">
          <div className="flex items-center justify-between md:mb-1">
            <h3 className="text-base font-bold text-white md:text-lg lg:text-xl">
              {title}
            </h3>
            <span className="hidden text-4xl font-black text-imet-aqua-light/30 md:inline">
              {number}
            </span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-imet-aqua-light md:mt-0 md:text-xs">
            {timing}
          </div>
        </div>

        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-imet-aqua-light transition-transform md:hidden ${
            open ? "rotate-180" : ""
          }`}
        />

        {/* Desktop content */}
        <div className="hidden md:block">
          <p className="mb-5 mt-4 text-sm leading-relaxed text-white/70">
            {description}
          </p>
          <ul className="space-y-2 border-t border-white/10 pt-4">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-xs text-white/80"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-imet-aqua" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </button>

      {/* Mobile collapsible content */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out md:hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5">
          <p className="mb-4 text-sm leading-relaxed text-white/70">
            {description}
          </p>
          <ul className="space-y-2 border-t border-white/10 pt-4">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-xs text-white/80"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-imet-aqua" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Stages() {
  return (
    <section
      id="etapas"
      className="section relative overflow-hidden bg-imet-aqua-deep"
    >
      <div className="absolute inset-0 circuit-decoration opacity-20" />
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-imet-aqua/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-imet-aqua-light/10 blur-3xl" />

      <div className="container-tight relative">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <div className="mb-4 inline-block rounded-full bg-imet-aqua/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-imet-aqua-light sm:px-4 sm:text-xs">
            Proceso
          </div>
          <h2 className="mb-4 text-[26px] font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            3 etapas hacia tu beca
          </h2>
          <p className="text-base text-imet-mint/90 sm:text-lg">
            Un proceso claro y transparente. Aquí te explicamos qué pasa desde
            que envías tu formulario hasta que recibes tu resultado.
          </p>
          <p className="mt-3 text-xs text-imet-aqua-light md:hidden">
            Toca cada etapa para ver el detalle.
          </p>
        </div>

        <div className="relative grid gap-3 md:grid-cols-3 md:gap-6">
          {/* Línea conectora */}
          <div className="absolute left-[10%] right-[10%] top-12 hidden h-px bg-gradient-to-r from-transparent via-imet-aqua-light/40 to-transparent md:block" />

          {stages.map((s) => (
            <StageCard key={s.number} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
