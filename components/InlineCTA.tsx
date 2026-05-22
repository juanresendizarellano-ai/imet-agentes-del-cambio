import { ArrowRight } from "lucide-react";

/**
 * Mini-CTA contextual al final de secciones intermedias. Mantiene al usuario
 * cerca del momento de conversion sin esperar a llegar al form del final.
 * Variantes "light" (sobre fondos cremas/blancos) y "dark" (sobre fondos navy).
 */
export default function InlineCTA({
  message,
  variant = "light",
  href = "#hero-form",
  cta = "Aplicar a la beca",
}: {
  message: string;
  variant?: "light" | "dark";
  href?: string;
  cta?: string;
}) {
  const isDark = variant === "dark";
  return (
    <div
      className={`mt-10 flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-5 text-center sm:mt-12 sm:flex-row sm:justify-between sm:gap-6 sm:p-6 sm:text-left ${
        isDark
          ? "border-imet-aqua-light/40 bg-white/[0.04] backdrop-blur-sm"
          : "border-imet-aqua/30 bg-white"
      }`}
    >
      <p
        className={`text-sm font-medium sm:text-base ${
          isDark ? "text-white" : "text-imet-navy"
        }`}
      >
        {message}
      </p>
      <a href={href} className="btn-primary-hero flex-shrink-0 text-sm">
        {cta}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
