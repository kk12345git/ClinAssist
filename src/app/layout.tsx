import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { PatientProvider } from "../context/PatientContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "ClinAssist — AI Clinical Case-Taking & Decision Support System",
  description: "Multilingual AI-assisted clinical case-taking, dynamic adaptive questions, document OCR, red-flag triage review, and case sheet PDF export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} dark`}>
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen antialiased selection:bg-teal-500 selection:text-slate-950">
        <LanguageProvider>
          <PatientProvider>
            {children}
          </PatientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
