import { Check, X } from "lucide-react";

const rows = [
  { label: "Inscripción", without: "$3,000 MXN", with: "GRATIS" },
  { label: "Beca en colegiatura", without: "—", with: "50% de descuento" },
  { label: "Taller de Desarrollo Humano", without: "—", with: "Incluido" },
  { label: "Taller de IA Aplicada", without: "—", with: "Incluido" },
  { label: "iMET Academy", without: "—", with: "Acceso ilimitado" },
  { label: "Vinculación laboral con empresas", without: "—", with: "Incluida" },
  { label: "Masterclass + insignia LinkedIn", without: "—", with: "1 por cuatrimestre" },
  { label: "Convenios locales (+20)", without: "—", with: "Acceso completo" },
  { label: "Convenios nacionales", without: "—", with: "Acceso completo" },
];

export default function Comparison() {
  return (
    <section className="section bg-white">
      <div className="container-tight">
        <div className="mb-10 max-w-2xl sm:mb-12">
          <div className="eyebrow mb-4">Comparativa</div>
          <h2 className="heading-lg mb-4">
            Lo que cambia con Agentes del Cambio
          </h2>
          <p className="lead">
            La diferencia no es solo el costo: es el ecosistema completo de
            formación, talleres y vinculación que se abre cuando entras al
            programa.
          </p>
        </div>

        {/* Versión desktop: tabla 3 columnas */}
        <div className="hidden overflow-hidden rounded-3xl border border-slate-100 shadow-lg sm:block">
          <div className="grid grid-cols-[1.4fr,1fr,1.2fr] bg-imet-navy text-white">
            <div className="px-5 py-5 text-xs font-bold uppercase tracking-widest text-white/60 sm:px-7">
              Beneficio
            </div>
            <div className="border-l border-white/10 px-5 py-5 text-center text-xs font-bold uppercase tracking-widest text-white/60 sm:px-7">
              Sin el programa
            </div>
            <div className="border-l border-white/10 bg-imet-aqua px-5 py-5 text-center text-xs font-bold uppercase tracking-widest text-white sm:px-7">
              Agentes del Cambio
            </div>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1.4fr,1fr,1.2fr] items-center ${
                i % 2 === 0 ? "bg-imet-cream" : "bg-white"
              }`}
            >
              <div className="px-5 py-4 text-sm font-medium text-imet-navy sm:px-7 sm:py-5">
                {row.label}
              </div>
              <div className="border-l border-slate-100 px-5 py-4 text-center sm:px-7 sm:py-5">
                <div className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                  {row.without === "—" ? (
                    <X className="h-4 w-4 text-slate-400" />
                  ) : null}
                  {row.without}
                </div>
              </div>
              <div className="border-l border-slate-100 px-5 py-4 text-center sm:px-7 sm:py-5">
                <div className="inline-flex items-center gap-1.5 text-sm font-bold text-imet-aqua-dark">
                  <Check className="h-4 w-4" />
                  {row.with}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Versión móvil: card unificada */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg sm:hidden">
          {/* Header strip */}
          <div className="flex">
            <div className="flex-1 bg-slate-100 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Sin el programa
            </div>
            <div className="flex-1 bg-imet-aqua px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white">
              Agentes del Cambio
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {rows.map((row) => (
              <div key={row.label}>
                <div className="px-4 pt-3 pb-1.5 text-[13px] font-bold text-imet-navy">
                  {row.label}
                </div>
                <div className="flex">
                  <div className="flex-1 px-4 pb-3">
                    <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
                      {row.without === "—" ? (
                        <X className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                      ) : null}
                      <span>{row.without}</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-imet-mint/30 px-4 py-2">
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-imet-aqua-dark">
                      <Check className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{row.with}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
