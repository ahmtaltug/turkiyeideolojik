import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import TrafficAnalytics from "@/components/TrafficAnalytics";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const description =
  "Kaydırmalı sorularla Türkiye siyasetindeki yerini keşfet: 13 ideoloji, 4 eksen ve lider uyumu. Bilimsel bir ölçüm değildir.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    siteName: SITE_NAME,
    images: [{ url: "/og", width: 1200, height: 630, alt: "Türkiye İdeolojik" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Türkiye İdeolojik - Siyasi Kimliğini Keşfet",
    description: "Seni en iyi ifade eden ideolojiyi bul.",
    images: ["/og"],
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
        {/* Plain gradients instead of blur() filters: far cheaper to composite on phones. */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(40% 40% at 10% 10%, rgba(220,38,38,0.12), transparent 70%), radial-gradient(40% 40% at 90% 90%, rgba(37,99,235,0.12), transparent 70%)",
          }}
        />
        {children}
        <TrafficAnalytics />
      </body>
    </html>
  );
}
