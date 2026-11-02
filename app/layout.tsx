import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Birthday, Bestie | To My Partner In Crime",
  description: "An interactive, cinematic birthday scrollytelling journey and handwritten letter celebrating an unbreakable friendship.",
};

export const viewport: Viewport = {
  themeColor: "#FFF5F7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="bg-[#FFF5F7] text-[#4C0519] font-sans antialiased selection:bg-[#FB7185]/30 selection:text-[#881337] min-h-screen">
        {children}
      </body>
    </html>
  );
}
