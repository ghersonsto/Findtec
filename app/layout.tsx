import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google";

import { SiteFrame } from "@/components/site-frame";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { company } from "@/lib/company";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

const siteUrl = company.siteUrl || "https://findtec.pe";
const description =
  company.description ||
  "Software de gestión, integraciones con IA, digitalización e infraestructura TI para empresas e instituciones en Perú.";
const siteName = company.name || "Findtec Soluciones";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Findtec Soluciones",
    template: "%s | Findtec Soluciones",
  },
  description,
  keywords: [
    "Findtec Soluciones",
    "ERP",
    "Laravel",
    "Vue.js",
    "MySQL",
    "Docker",
    "FastAPI",
    "Python",
    "Microsoft 365",
    "digitalización Perú",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName,
    title: "Findtec Soluciones | Digitalización con software e IA",
    description,
    images: [
      {
        url: `${siteUrl}/images/findtec-mark.png`,
        width: 512,
        height: 512,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Findtec Soluciones | Software e IA para negocios",
    description,
    images: [`${siteUrl}/images/findtec-mark.png`],
  },
  icons: {
    icon: [{ url: "/images/findtec-mark.png", type: "image/png" }],
    apple: [{ url: "/images/findtec-mark.png", type: "image/png" }],
    shortcut: "/images/findtec-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground selection:bg-blue-600/20 selection:text-blue-500">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="findtec-theme"
          disableTransitionOnChange
        >
          <SiteFrame>{children}</SiteFrame>

          {/* Notificaciones estilo Emil Kowalski con bordes impecables */}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              className:
                "border border-black/[0.08] dark:border-white/[0.1] shadow-2xl backdrop-blur-xl bg-background/90 text-foreground",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}