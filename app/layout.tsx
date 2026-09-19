import { ThemeProvider } from "@/components/theme-provider";
import { company } from "@/lib/company";
import "./globals.css";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-background" suppressHydrationWarning>
      <head>
        <title>FindTec Soluciones | Servicios TI, hardware y soporte empresarial</title>
        <meta name="description" content={company.description} />
        <meta
          name="keywords"
          content="FindTec, servicios TI Perú, soporte técnico empresarial, Microsoft 365, hardware empresarial, desarrollo web, automatización, Power BI"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={company.siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:site_name" content={company.name} />
        <meta property="og:title" content="FindTec Soluciones | Tecnología que impulsa resultados" />
        <meta property="og:description" content={company.description} />
        <meta property="og:image" content={`${company.siteUrl}/images/hero-tech.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FindTec Soluciones | Servicios TI empresariales" />
        <meta name="twitter:description" content={company.description} />
        <meta name="twitter:image" content={`${company.siteUrl}/images/hero-tech.jpg`} />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
