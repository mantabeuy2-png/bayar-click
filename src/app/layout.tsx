import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Bayar — QRIS Statis Jadi Alat Jualan Online",
  description: "Ubah QRIS merchant milikmu menjadi QR dinamis, payment link, dashboard transaksi, dan API pembayaran. Tanpa potongan, tanpa ribet.",
  keywords: ["qris", "payment link", "qr dinamis", "checkout online", "bayar", "umkm", "donasi online", "qris wordpress"],
  openGraph: {
    title: "Bayar — QRIS Statis Jadi Alat Jualan Online",
    description: "Ubah QRIS merchant milikmu menjadi QR dinamis, payment link, dashboard transaksi, dan API pembayaran.",
    url: "https://bayar.click",
    siteName: "Bayar",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
