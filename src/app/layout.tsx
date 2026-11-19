import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const description =
  "Kaydırmalı sorularla Türkiye siyasetindeki yerini keşfet: 13 ideoloji, 4 eksen ve lider uyumu. Eğlence amaçlıdır, bilimsel değildir.";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Türkiye İdeolojik - Siyasi Kimlik Testi",
  description,
  applicationName: "Türkiye İdeolojik",
  keywords: ["siyasi pusula", "türkiye siyaseti", "ideoloji testi", "seçim", "parti eşleşme", "kemalizm", "ülkücülük", "liberalizm"],
  authors: [{ name: "Türkiye İdeolojik" }],
  openGraph: {
    title: "Türkiye İdeolojik - Siyasi Kimliğini Keşfet",
    description: "40 soruda Türkiye siyasetindeki yerini öğren.",
    type: "website",
    locale: "tr_TR",
    siteName: "Türkiye İdeolojik",
  },
  twitter: {
    card: "summary_large_image",
    title: "Türkiye İdeolojik - Siyasi Kimliğini Keşfet",
    description: "Seni en iyi ifade eden ideolojiyi bul.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased selection:bg-red-500/30 font-sans">
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
