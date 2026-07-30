import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CATEGORIES } from "@/lib/jobs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TrabajoRemoto.es — Empleos remotos para hispanohablantes",
    template: "%s | TrabajoRemoto.es",
  },
  description:
    "Bolsa de empleo remoto para hispanohablantes de LATAM y España. Vacantes actualizadas a diario en desarrollo, diseño, marketing, ventas y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <header className="border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="font-bold text-lg tracking-tight">
              Trabajo<span className="text-blue-600">Remoto</span>
            </Link>
            <nav className="hidden md:flex gap-4 text-sm text-neutral-600 overflow-x-auto">
              {CATEGORIES.slice(0, 5).map((c) => (
                <Link
                  key={c.slug}
                  href={`/categoria/${c.slug}`}
                  className="hover:text-blue-600 whitespace-nowrap"
                >
                  {c.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/destacar-vacante"
              className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 whitespace-nowrap"
            >
              Publicar vacante
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 mt-12">
          <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-neutral-500 flex flex-col gap-2">
            <p>
              TrabajoRemoto agrega vacantes públicas de{" "}
              <a href="https://remoteok.com" className="underline hover:text-blue-600">
                Remote OK
              </a>
              ,{" "}
              <a href="https://jobicy.com" className="underline hover:text-blue-600">
                Jobicy
              </a>{" "}
              y{" "}
              <a href="https://himalayas.app" className="underline hover:text-blue-600">
                Himalayas
              </a>
              . Todas las solicitudes se procesan en el sitio original de cada
              oferta.
            </p>
            <p>© {new Date().getFullYear()} TrabajoRemoto.es</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
