import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-circuit pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32"
    >
      <div className="container-tight px-5 sm:px-6 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr,1fr] lg:gap-12">
          <div className="animate-fade-in-up">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-imet-aqua/30 bg-white px-3 py-1.5 text-[11px] font-semibold text-imet-aqua-dark shadow-sm sm:mb-6 sm:px-4 sm:text-xs">
              <Sparkles className="h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5" />
              <span className="truncate">iMET, líder en IA del sureste mexicano</span>
            </div>

            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-imet-aqua-dark sm:text-xs">
              Programa Impulso a la Educación iMET
            </div>

            <h1 className="heading-xl mb-5 sm:mb-6">
              iMET{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-imet-aqua to-imet-aqua-dark bg-clip-text text-transparent">
                  Agentes del Cambio
                </span>
                <span className="absolute -bottom-1 left-0 -z-0 h-3 w-full rounded-full bg-imet-mint" />
              </span>
            </h1>

            <p className="lead mb-7 max-w-xl sm:mb-8">
              Una iniciativa del{" "}
              <strong className="text-imet-navy">Dip. Pepe Canto</strong>{" "}
              en coordinación con iMET. Beca del{" "}
              <strong className="text-imet-navy">50% en colegiaturas</strong>{" "}
              e <strong className="text-imet-navy">inscripción gratuita</strong>{" "}
              en licenciaturas y maestrías para democratizar la educación superior
              de calidad en Yucatán.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#aplicar" className="btn-primary w-full sm:w-auto">
                Aplicar a la beca
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#programa" className="btn-secondary w-full sm:w-auto">
                Conocer el programa
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-slate-500 sm:mt-10 sm:gap-x-8 sm:gap-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-imet-aqua" />
                Sin examen de admisión
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-imet-aqua" />
                Presencial, ejecutiva y virtual
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-imet-aqua" />
                Mérida, Yucatán
              </div>
            </div>
          </div>

          {/* Cifras: stack vertical en mobile, grid 2x2 en desktop */}
          <div className="relative animate-fade-in lg:justify-self-end">
            <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-imet-aqua/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-64 w-64 rounded-full bg-imet-mint blur-3xl" />

            <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-2 rounded-2xl bg-aqua-gradient p-6 text-white shadow-xl shadow-imet-aqua/30 sm:p-7">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Beneficio principal
                </div>
                <div className="mt-2 text-4xl font-black leading-none sm:text-5xl">
                  50%
                </div>
                <div className="mt-2 text-sm font-medium text-white/90">
                  Beca en colegiaturas durante toda tu carrera
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-100 sm:p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Inscripción
                </div>
                <div className="mt-1 text-2xl font-black text-imet-navy sm:text-3xl">
                  $0
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Bonificada al 100%
                </div>
              </div>

              <div className="rounded-2xl bg-imet-navy p-4 text-white shadow-lg sm:p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Ahorras hasta
                </div>
                <div className="mt-1 text-2xl font-black sm:text-3xl">$3.5K</div>
                <div className="mt-1 text-xs text-white/70">MXN al mes</div>
              </div>

              <div className="col-span-2 rounded-2xl border-2 border-dashed border-imet-aqua/40 bg-white p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-imet-mint sm:h-10 sm:w-10">
                    <Sparkles className="h-4 w-4 text-imet-aqua-dark" />
                  </div>
                  <div className="text-xs font-medium text-imet-navy sm:text-sm">
                    + Insignia LinkedIn cada cuatrimestre
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
