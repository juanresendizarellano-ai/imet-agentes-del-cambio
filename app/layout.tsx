import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Impulso a la Educación iMET — Agentes del Cambio",
  description:
    "Iniciativa del Dip. Pepe Canto en coordinación con iMET. Beca del 50% en colegiaturas e inscripción gratuita en licenciaturas y maestrías.",
  openGraph: {
    title: "Impulso a la Educación iMET — Agentes del Cambio",
    description:
      "Beca del 50% en colegiaturas e inscripción gratuita en licenciaturas y maestrías de iMET. Iniciativa del Dip. Pepe Canto.",
    type: "website",
    locale: "es_MX",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#14B8A6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
