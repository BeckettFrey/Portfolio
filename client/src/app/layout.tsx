import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 
export const metadata = {
  title: "Beckett Frey",
  description: "Explore my projects, and everything else, all in one place.",
  keywords: ["Beckett Frey", "developer", "portfolio", "projects", "software"],
  authors: [{ name: "Beckett Frey", url: "https://beckettfrey.com" }],
  creator: "Beckett Frey",
  metadataBase: new URL("https://beckettfrey.com"),
  openGraph: {
    title: "Dashboard | Beckett Frey",
    description: "Explore my projects, and everything else, all in one place.",
    url: "https://beckettfrey.com",
    siteName: "Beckett Frey",
    images: [
      {
        url: "https://sora.chatgpt.com/g/gen_01jyjj710wetzsqt5z96nqr58t",
        alt: "Beckett Frey",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | Beckett Frey",
    description: "Explore my projects, and everything else, all in one place.",
    images: ["https://sora.chatgpt.com/g/gen_01jyjj710wetzsqt5z96nqr58t"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/shortcut-icon.png",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
