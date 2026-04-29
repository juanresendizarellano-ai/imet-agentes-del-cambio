import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iMET Agentes del Cambio | Beca Impulso a la Educación",
  description:
    "Aplica al programa Agentes del Cambio de iMET en coordinación con el Dip. Pepe Canto. 50% de beca, inscripción gratuita y acceso total a iMET Academy.",
  openGraph: {
    title: "iMET Agentes del Cambio",
    description:
      "Beca del 50% e inscripción gratuita en licenciaturas y maestrías de iMET.",
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
