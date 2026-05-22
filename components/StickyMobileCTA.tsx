"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Barra inferior fija en mobile con CTA al formulario. Se oculta:
 *   - Mientras el hero esta visible (no necesitamos un segundo CTA encima del principal).
 *   - Cuando el form principal (ApplicationForm con id="aplicar") esta visible.
 *
 * Implementacion: IntersectionObserver sobre dos sentinelas (el hero y el form).
 */
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const form = document.getElementById("aplicar");
    if (!hero || !form) return;

    let heroVisible = true;
    let formVisible = false;

    const update = () => setVisible(!heroVisible && !formVisible);

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.1 }
    );
    const formObs = new IntersectionObserver(
      ([entry]) => {
        formVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 }
    );

    heroObs.observe(hero);
    formObs.observe(form);

    return () => {
      heroObs.disconnect();
      formObs.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-imet-aqua/20 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,118,110,0.15)] backdrop-blur-md">
        <a
          href="#hero-form"
          className="btn-primary-hero w-full justify-center text-sm"
        >
          Aplicar a la beca del 50%
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
