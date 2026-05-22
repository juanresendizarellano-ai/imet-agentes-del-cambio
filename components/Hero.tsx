import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import LeadCaptureForm from "./LeadCaptureForm";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-circuit pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28"
    >
      <div className="container-tight px-5 sm:px-6 md:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr,1fr] lg:gap-12">
          <div className="animate-fade-in-up">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-imet-aqua/30 bg-white px-3 py-1.5 text-[11px] font-semibold text-imet-aqua-dark shadow-sm sm:mb-6 sm:px-4 sm:text-xs">
              <Sparkles className="h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5" />
              <span className="truncate">iMET, líder en IA del sureste mexicano</span>
            </div>

            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-imet-aqua-dark sm:text-xs">
              Programa Impulso a la Educación iMET
            </div>

            <h1 className="heading-xl mb-5 sm:mb-6">
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-imet-aqua to-imet-aqua-dark bg-clip-text text-transparent">
                  Agentes del Cambio
                </span>
                <span className="absolute -bottom-1 left-0 -z-0 h-3 w-full rounded-full bg-imet-mint" />
              </span>
            </h1>

            <p className="lead mb-6 max-w-xl sm:mb-7">
              Una iniciativa del{" "}
              <strong className="text-imet-navy">Dip. Pepe Canto</strong>{" "}
              en coordinación con iMET. Beca del{" "}
              <strong className="text-imet-navy">50% en colegiaturas</strong>{" "}
              e <strong className="text-imet-navy">inscripción gratuita</strong>{" "}
              en licenciaturas y maestrías.
            </p>

            {/* Cifras compactas — antes era panel de 4 cards al lado, ahora son
                stats inline para no robar atencion al mini-form. */}
            <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-imet-aqua/15 bg-white/80 p-3 backdrop-blur-sm sm:gap-3 sm:p-4">
              <Stat number="50%" label="Beca colegiatura" />
              <Stat number="$0" label="Inscripción" highlight />
              <Stat number="$3.5K" label="Ahorras al mes" />
            </div>

            {/* CTA secundario para quien quiere leer antes de inscribirse */}
            <div className="hidden sm:flex">
              <a
                href="#programa"
                className="inline-flex items-center gap-2 text-sm font-semibold text-imet-aqua-dark transition hover:text-imet-aqua hover:underline"
              >
                Conoce el programa primero
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 sm:mt-7 sm:gap-x-7">
              <Trust label="Sin examen de admisión" />
              <Trust label="Presencial, ejecutiva y virtual" />
              <Trust label="Mérida, Yucatán" />
            </div>
          </div>

          {/* Mini-form de captura — el corazon del nuevo flujo de conversion */}
          <div id="hero-form" className="relative lg:justify-self-end">
            <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-imet-aqua/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-64 w-64 rounded-full bg-imet-mint blur-3xl" />

            <div className="relative">
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  number,
  label,
  highlight,
}: {
  number: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-3 py-2.5 text-center ${
        highlight ? "bg-aqua-gradient text-white shadow-md shadow-imet-aqua/30" : "bg-white ring-1 ring-slate-100"
      }`}
    >
      <div
        className={`text-xl font-black leading-none sm:text-2xl ${
          highlight ? "text-white" : "text-imet-navy"
        }`}
      >
        {number}
      </div>
      <div
        className={`mt-1 text-[10px] font-medium leading-tight sm:text-xs ${
          highlight ? "text-white/85" : "text-slate-500"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-imet-aqua-dark" />
      <span>{label}</span>
    </div>
  );
}
