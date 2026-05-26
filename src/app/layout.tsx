import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout"; // Kita pindahin logic client ke sini

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  title: "Hezekiah Sagala | AI Engineer & Data Scientist",
  description: "Portfolio of Jody Hezekiah Tanasa Sagala focusing on Computer Vision and Applied AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} ${archivoBlack.variable}`}>
      <body style={{ margin: 0, background: "#0a0a0a" }}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}