import { Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-imet-navy py-14 text-white">
      <div className="container-tight px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr,1fr,1fr]">
          <div>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight">iMET</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-imet-aqua-light">
                Educación y Tecnología
              </span>
            </div>
            <p className="max-w-sm text-sm text-white/70">
              Universidad líder en inteligencia artificial del sureste mexicano.
              Formamos profesionales preparados para liderar la transformación
              digital.
            </p>
          </div>

          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-imet-aqua-light">
              Contacto
            </div>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-imet-aqua-light" />
                999 841 6440
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-imet-aqua-light" />
                Gran Plaza, C. 75 entre 42 y 50, 180, Montes de Amé, 97115
                Mérida, Yuc.
              </li>
              <li className="flex items-start gap-2">
                <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-imet-aqua-light" />
                <a
                  href="https://imet.edu.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  imet.edu.mx
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-imet-aqua-light">
              Programa
            </div>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="#programa" className="hover:text-white">
                  Sobre Agentes del Cambio
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-white">
                  Beneficios
                </a>
              </li>
              <li>
                <a href="#etapas" className="hover:text-white">
                  Proceso de selección
                </a>
              </li>
              <li>
                <a href="#aplicar" className="hover:text-white">
                  Aplicar a la beca
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center">
          <div>
            © {new Date().getFullYear()} iMET. En coordinación con el equipo
            del Dip. Pepe Canto Tamayo.
          </div>
          <div>Hecho con compromiso por la educación de Yucatán.</div>
        </div>
      </div>
    </footer>
  );
}
