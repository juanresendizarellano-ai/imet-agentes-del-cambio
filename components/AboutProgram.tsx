import { Building2, Users, GraduationCap } from "lucide-react";

export default function AboutProgram() {
  return (
    <section id="programa" className="section bg-white">
      <div className="container-tight">
        <div className="grid gap-10 lg:grid-cols-[1fr,1.2fr] lg:gap-12">
          <div>
            <div className="eyebrow mb-4">El programa</div>
            <h2 className="heading-lg mb-5 sm:mb-6">
              ¿Qué es Impulso a la Educación iMET — Agentes del Cambio?
            </h2>
            <p className="lead mb-5 sm:mb-6">
              Una iniciativa del{" "}
              <strong className="text-imet-navy">Dip. Pepe Canto</strong>{" "}
              diseñada para democratizar el acceso a la educación superior de
              calidad, ofreciendo condiciones excepcionales para estudiantes
              comprometidos con su crecimiento personal y profesional.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              En coordinación con iMET, el{" "}
              <strong className="text-imet-navy">Dip. Pepe Canto</strong>{" "}
              ofrece a los aspirantes una beca del 50% en colegiaturas e
              inscripción gratuita, alineadas a las necesidades del entorno
              actual y del futuro.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-imet-cream p-6 transition hover:border-imet-aqua/30 hover:shadow-md">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-imet-mint">
                <Building2 className="h-5 w-5 text-imet-aqua-dark" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-imet-navy">
                Vanguardia tecnológica
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Modelo educativo enfocado en IA, automatización y tecnología
                emergente integradas en cada programa.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-imet-cream p-6 transition hover:border-imet-aqua/30 hover:shadow-md sm:translate-y-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-imet-mint">
                <Users className="h-5 w-5 text-imet-aqua-dark" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-imet-navy">
                Aprendizaje práctico
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Colaboración, pensamiento crítico y networking dentro de un
                ecosistema emprendedor real.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-imet-cream p-6 transition hover:border-imet-aqua/30 hover:shadow-md">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-imet-mint">
                <GraduationCap className="h-5 w-5 text-imet-aqua-dark" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-imet-navy">
                Educación con propósito
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Valores éticos, responsabilidad social e innovación al servicio
                del bienestar colectivo.
              </p>
            </div>

            <div className="rounded-2xl bg-navy-gradient p-6 text-white shadow-lg sm:translate-y-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                Sede
              </div>
              <div className="mt-2 text-base font-bold">
                Gran Plaza, Mérida
              </div>
              <div className="mt-1 text-xs text-white/70">
                C. 75 entre 42 y 50, Montes de Amé, 97115
              </div>
              <a
                href="https://imet.edu.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-xs font-semibold text-imet-aqua-light hover:underline"
              >
                imet.edu.mx →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
