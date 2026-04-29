"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const licenciaturas = [
  { name: "Administración de Empresas", modes: "Todas las modalidades" },
  { name: "Derecho", modes: "Todas las modalidades" },
  { name: "Contabilidad Financiera", modes: "Escolarizada / Ejecutiva" },
  { name: "Educación", modes: "Virtual" },
  { name: "Inteligencia Artificial y Ciencia de Datos", modes: "Aula extendida" },
  { name: "Ingeniería de Software", modes: "Aula extendida" },
];

const maestrias = [
  { name: "Alta Dirección", modes: "Ejecutiva" },
  { name: "Comunicación Organizacional", modes: "Ejecutiva" },
  { name: "Derecho Empresarial", modes: "Ejecutiva" },
  { name: "Gestión Educativa", modes: "Virtual" },
  { name: "Finanzas", modes: "Virtual" },
  { name: "Economía", modes: "Virtual" },
  { name: "Interiorismo y Diseño Urbano", modes: "Virtual" },
];

type Variant = "lic" | "maes";

function ProgramCard({
  variant,
  programs,
}: {
  variant: Variant;
  programs: { name: string; modes: string }[];
}) {
  const [openMobile, setOpenMobile] = useState(false);
  const isMaestria = variant === "maes";

  const cardClasses = isMaestria
    ? "rounded-3xl bg-navy-gradient text-white shadow-xl"
    : "rounded-3xl border border-slate-100 bg-imet-cream";

  const badgeClasses = isMaestria
    ? "bg-white/10 text-imet-aqua-light"
    : "bg-imet-aqua/10 text-imet-aqua-dark";

  const titleClasses = isMaestria ? "text-white" : "text-imet-navy";
  const priceTextClasses = isMaestria ? "text-white/70" : "text-slate-500";
  const priceStrong = isMaestria ? "text-white" : "text-imet-navy";
  const dividerClasses = isMaestria ? "divide-white/10" : "divide-slate-200";
  const itemNameClasses = isMaestria ? "text-white" : "text-imet-navy";
  const itemModeClasses = isMaestria ? "text-white/60" : "text-slate-500";
  const chevronClasses = isMaestria ? "text-imet-aqua-light" : "text-imet-aqua-dark";

  const heading = isMaestria ? "Especialízate y lidera" : "Comienza tu carrera";
  const badge = isMaestria ? "Maestrías" : "Licenciaturas";
  const price = isMaestria ? "$1,890 MXN/mes" : "$1,680 MXN/mes";

  return (
    <div className={cardClasses}>
      {/* Toggle button (mobile) / Static header (desktop) */}
      <button
        type="button"
        onClick={() => setOpenMobile((v) => !v)}
        aria-expanded={openMobile}
        className="flex w-full items-center justify-between gap-4 p-6 text-left lg:cursor-default sm:p-8"
      >
        <div className="flex-1">
          <div
            className={`mb-2 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${badgeClasses}`}
          >
            {badge}
          </div>
          <h3
            className={`mb-1 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl ${titleClasses}`}
          >
            {heading}
          </h3>
          <div className={`text-sm ${priceTextClasses}`}>
            Desde <strong className={priceStrong}>{price}</strong> con beca
          </div>
          <div className={`mt-1 text-xs lg:hidden ${priceTextClasses}`}>
            {programs.length} programas disponibles
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 transition-transform lg:hidden ${chevronClasses} ${
            openMobile ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* List (collapsible on mobile, always visible on desktop) */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:!max-h-none lg:!opacity-100 ${
          openMobile ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className={`px-6 pb-6 sm:px-8 sm:pb-8 lg:pt-0 ${dividerClasses} divide-y`}>
          {programs.map((p) => (
            <li
              key={p.name}
              className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <span className={`text-sm font-medium ${itemNameClasses}`}>
                {p.name}
              </span>
              <span className={`text-xs sm:text-right ${itemModeClasses}`}>
                {p.modes}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Programs() {
  return (
    <section className="section bg-white">
      <div className="container-tight">
        <div className="mb-10 max-w-2xl sm:mb-12">
          <div className="eyebrow mb-4">Oferta académica</div>
          <h2 className="heading-lg mb-4">
            Programas disponibles con beca del 50%
          </h2>
          <p className="lead">
            Elige entre licenciaturas o maestrías de iMET. Todas con la misma
            beca y el mismo nivel académico.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <ProgramCard variant="lic" programs={licenciaturas} />
          <ProgramCard variant="maes" programs={maestrias} />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Los precios están sujetos a ajuste anual conforme al índice de
          inflación. iMET notifica oportunamente cualquier actualización.
        </p>
      </div>
    </section>
  );
}
