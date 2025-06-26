import ButtonGrid from "@/components/ButtonGrid";
import { CorePage } from "@/layout";

export const metadata = {
  title: "Dashboard | Beckett Frey",
  description: "Explore Beckett's projects, tools, and ideas — all from one place.",
  keywords: ["Beckett Frey", "developer", "portfolio", "projects", "software"],
  authors: [{ name: "Beckett Frey", url: "https://beckettfrey.com" }],
  creator: "Beckett Frey",
  metadataBase: new URL("https://beckettfrey.com"),
  openGraph: {
    title: "Dashboard | Beckett Frey",
    description: "Explore Beckett's projects, tools, and ideas — all from one place.",
    url: "https://beckettfrey.com",
    siteName: "Beckett Frey",
    images: [
      {
        url: "https://beckettfrey.com/share.png",
        width: 1200,
        height: 630,
        alt: "Beckett Frey Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | Beckett Frey",
    description: "Explore Beckett's projects, tools, and ideas — all from one place.",
    images: ["https://beckettfrey.com/share.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/shortcut-icon.png",
    apple: "/apple-touch-icon.png",
  },

};


const LandingPage = () => {

  return (
    <CorePage header="Dashboard" showHomeButton={false}>
      <ButtonGrid />
    </CorePage>
  );
};

export default LandingPage;
