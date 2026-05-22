"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

// Inicio del cuatrimestre — definido por el cliente (Dip. Pepe Canto).
// Las aplicaciones cierran al inicio del cuatrimestre, asi que esa es la
// fecha tope del countdown.
const DEADLINE = new Date("2026-09-01T00:00:00-06:00"); // CDMX timezone

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
};

function getRemaining(now: number): Remaining {
  const diff = DEADLINE.getTime() - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes, expired: false };
}

export default function UrgencyBanner() {
  // null durante SSR para evitar hydration mismatch (Date.now cambia entre
  // server y client). Recien en useEffect montamos el contador.
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(getRemaining(Date.now()));
    tick();
    // Actualizar cada minuto basta — los segundos generan parpadeo molesto
    // y no aportan urgencia real para un countdown de meses.
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!remaining || remaining.expired) return null;

  return (
    <div className="bg-gradient-to-r from-imet-aqua-dark via-imet-aqua to-imet-aqua-dark text-white shadow-md">
      <div className="container-tight flex items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-2.5 md:px-10">
        <div className="flex items-center gap-2 text-[11px] font-semibold sm:gap-3 sm:text-xs">
          <span className="hidden h-2 w-2 animate-countdown-pulse rounded-full bg-white sm:inline-block" />
          <Clock className="h-3.5 w-3.5 flex-shrink-0 sm:hidden" />
          <span className="truncate">
            <span className="hidden sm:inline">
              Convocatoria cierra el 01 SEPT — quedan{" "}
            </span>
            <span className="sm:hidden">Quedan </span>
            <CountdownPills remaining={remaining} />
          </span>
        </div>
        <a
          href="#hero-form"
          className="flex-shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-imet-aqua-dark shadow-sm transition hover:bg-imet-mint sm:px-4 sm:text-xs"
        >
          Aplicar ahora
        </a>
      </div>
    </div>
  );
}

function CountdownPills({ remaining }: { remaining: Remaining }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Pill label="d" value={remaining.days} />
      <Pill label="h" value={remaining.hours} />
      <Pill label="m" value={remaining.minutes} />
    </span>
  );
}

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-baseline gap-0.5 rounded-md bg-white/15 px-1.5 py-0.5 font-mono tabular-nums">
      <span className="text-xs font-black sm:text-sm">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] font-bold uppercase opacity-80 sm:text-[10px]">
        {label}
      </span>
    </span>
  );
}
