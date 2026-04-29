import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container-tight flex items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-2 md:px-10">
        <a href="#hero" className="flex items-center">
          <Image
            src="/pepe-canto-logo.svg"
            alt="Pepe Canto Tamayo — Agentes del Cambio"
            width={504}
            height={360}
            priority
            unoptimized
            className="h-12 w-auto object-contain sm:h-14 md:h-16"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#programa"
            className="text-sm font-medium text-slate-700 transition hover:text-imet-aqua-dark"
          >
            Programa
          </a>
          <a
            href="#beneficios"
            className="text-sm font-medium text-slate-700 transition hover:text-imet-aqua-dark"
          >
            Beneficios
          </a>
          <a
            href="#etapas"
            className="text-sm font-medium text-slate-700 transition hover:text-imet-aqua-dark"
          >
            Proceso
          </a>
          <a href="#aplicar" className="btn-primary px-6 py-2.5 text-sm">
            Aplicar a la beca
          </a>
        </nav>

        <a
          href="#aplicar"
          className="btn-primary flex-shrink-0 px-4 py-2 text-xs md:hidden"
        >
          Aplicar
        </a>
      </div>
    </header>
  );
}
