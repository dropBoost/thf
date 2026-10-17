import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "THF | Stampa e Personalizzazione B2B",
  description: "Sviluppato da dropboost.it",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
