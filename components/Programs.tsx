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

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <div className="rounded-3xl border border-slate-100 bg-imet-cream p-6 sm:p-8">
            <div className="mb-2 inline-block rounded-full bg-imet-aqua/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-imet-aqua-dark">
              Licenciaturas
            </div>
            <h3 className="heading-md mb-1">Comienza tu carrera</h3>
            <div className="mb-5 text-sm text-slate-500 sm:mb-6">
              Desde <strong className="text-imet-navy">$1,680 MXN/mes</strong>{" "}
              con beca
            </div>
            <ul className="space-y-3">
              {licenciaturas.map((p) => (
                <li
                  key={p.name}
                  className="flex flex-col gap-1 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                >
                  <span className="text-sm font-medium text-imet-navy">
                    {p.name}
                  </span>
                  <span className="text-xs text-slate-500 sm:text-right">
                    {p.modes}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-navy-gradient p-6 text-white shadow-xl sm:p-8">
            <div className="mb-2 inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-imet-aqua-light">
              Maestrías
            </div>
            <h3 className="mb-1 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Especialízate y lidera
            </h3>
            <div className="mb-5 text-sm text-white/70 sm:mb-6">
              Desde <strong className="text-white">$1,890 MXN/mes</strong> con
              beca
            </div>
            <ul className="space-y-3">
              {maestrias.map((p) => (
                <li
                  key={p.name}
                  className="flex flex-col gap-1 border-b border-white/10 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                >
                  <span className="text-sm font-medium text-white">
                    {p.name}
                  </span>
                  <span className="text-xs text-white/60 sm:text-right">
                    {p.modes}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Los precios están sujetos a ajuste anual conforme al índice de
          inflación. iMET notifica oportunamente cualquier actualización.
        </p>
      </div>
    </section>
  );
}
