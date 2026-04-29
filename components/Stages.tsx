import { ClipboardList, Users2, Trophy } from "lucide-react";

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
        </div>

        <div className="relative grid gap-5 md:grid-cols-3 md:gap-6">
          {/* Línea conectora */}
          <div className="absolute left-[10%] right-[10%] top-12 hidden h-px bg-gradient-to-r from-transparent via-imet-aqua-light/40 to-transparent md:block" />

          {stages.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.number}
                className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition hover:border-imet-aqua-light/40 hover:bg-white/[0.06] sm:p-7"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-imet-aqua text-white shadow-lg shadow-imet-aqua/40 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-4xl font-black text-imet-aqua-light/30">
                    {s.number}
                  </span>
                </div>

                <h3 className="mb-1 text-lg font-bold text-white sm:text-xl">
                  {s.title}
                </h3>
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-imet-aqua-light sm:text-xs">
                  {s.timing}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-white/70">
                  {s.description}
                </p>

                <ul className="space-y-2 border-t border-white/10 pt-4">
                  {s.bullets.map((b) => (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
