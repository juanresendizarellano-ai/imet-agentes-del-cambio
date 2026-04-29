"use client";

import { useState } from "react";
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
  ChevronDown,
  type LucideIcon,
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

function BenefitCard({
  icon: Icon,
  number,
  title,
  description,
}: {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:border-imet-aqua/30 hover:shadow-xl hover:shadow-imet-aqua/10 md:hover:-translate-y-1">
      <div className="pointer-events-none absolute -right-3 -top-3 text-7xl font-black text-imet-mint opacity-50 transition group-hover:opacity-80">
        {number}
      </div>

      {/* Header (toggle on mobile, always visible on desktop) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="relative flex w-full items-center gap-4 p-5 text-left md:cursor-default md:block md:p-7"
      >
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-aqua-gradient shadow-md shadow-imet-aqua/30 md:mb-4 md:h-12 md:w-12">
          <Icon className="h-5 w-5 text-white md:h-6 md:w-6" />
        </div>
        <h3 className="flex-1 text-base font-bold text-imet-navy md:mb-2 md:text-lg">
          {title}
        </h3>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-imet-aqua-dark transition-transform md:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
        {/* Desktop description */}
        <p className="hidden text-sm leading-relaxed text-slate-600 md:block">
          {description}
        </p>
      </button>

      {/* Mobile collapsible description */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out md:hidden ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

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
          <p className="mt-3 text-xs text-slate-500 md:hidden">
            Toca cada beneficio para ver el detalle.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <BenefitCard key={b.number} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}
