import {
  Percent,
  CheckCircle2,
  Heart,
  Cpu,
  BookOpen,
  Briefcase,
  Award,
  Handshake,
  Globe2,
} from "lucide-react";

const benefits = [
  {
    icon: Percent,
    number: "01",
    title: "50% de beca en colegiatura",
    description:
      "Paga la mitad de tu colegiatura mensual durante toda tu carrera, sin condicionantes adicionales.",
  },
  {
    icon: CheckCircle2,
    number: "02",
    title: "Inscripción gratis",
    description:
      "El costo de inscripción ($3,000 MXN) queda completamente bonificado. Tu inversión empieza en tu formación.",
  },
  {
    icon: Heart,
    number: "03",
    title: "Taller de Desarrollo Humano",
    description:
      "Habilidades blandas, liderazgo e inteligencia emocional. Las competencias que el mercado pide y nadie enseña.",
  },
  {
    icon: Cpu,
    number: "04",
    title: "Taller de IA Aplicada",
    description:
      "Capacidades tecnológicas aplicadas a tu carrera: herramientas digitales, automatización y tendencias del sector.",
  },
  {
    icon: BookOpen,
    number: "05",
    title: "Acceso ilimitado a iMET Academy",
    description:
      "Plataforma educativa digital con contenidos exclusivos, recursos de aprendizaje y herramientas de desarrollo profesional.",
  },
  {
    icon: Briefcase,
    number: "06",
    title: "Vinculación laboral con empresas",
    description:
      "Vive el aprendizaje desde adentro de una empresa: procesos reales, red de contactos y criterio profesional desde la carrera.",
  },
  {
    icon: Award,
    number: "07",
    title: "Masterclass + insignia LinkedIn",
    description:
      "Una masterclass cuatrimestral con expertos del sector y una insignia digital certificada para tu perfil de LinkedIn.",
  },
  {
    icon: Handshake,
    number: "08",
    title: "Más de 20 convenios locales",
    description:
      "Acceso a una red de empresas y organizaciones aliadas en Yucatán para prácticas, vinculación y oportunidades laborales.",
  },
  {
    icon: Globe2,
    number: "09",
    title: "Convenios nacionales",
    description:
      "Alianzas estratégicas a nivel nacional que potencian tu formación académica y amplían tu horizonte profesional.",
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="section bg-imet-cream">
      <div className="container-tight">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <div className="eyebrow mb-4">Beneficios</div>
          <h2 className="heading-lg mb-4">
            9 razones por las que esta beca cambia tu futuro
          </h2>
          <p className="lead">
            Va mucho más allá de un descuento: es un paquete completo de
            formación, networking y experiencia profesional real.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.number}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 transition hover:-translate-y-1 hover:border-imet-aqua/30 hover:shadow-xl hover:shadow-imet-aqua/10 sm:p-7"
              >
                <div className="absolute -right-3 -top-3 text-7xl font-black text-imet-mint opacity-50 transition group-hover:opacity-80">
                  {b.number}
                </div>
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-aqua-gradient shadow-md shadow-imet-aqua/30">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-imet-navy">
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
