import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Türkiyeİdeolojik - Siyasi Kimliğini Keşfet",
  description: "Tinder usulü kaydırmalı sorularla Türkiye siyasetindeki gerçek kimliğini keşfet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased selection:bg-red-500/30 font-sans">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
