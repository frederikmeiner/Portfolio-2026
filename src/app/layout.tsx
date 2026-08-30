import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";

/**
 * Fontene selvhostes af Next i stedet for at hentes fra Google ved runtime.
 * Et @import i CSS'en tvinger browseren gennem en kæde — HTML, vores CSS,
 * Googles CSS, fontfilerne — hvor hvert led blokerer render. Her ligger
 * filerne på vores eget domæne og preloades sammen med siden.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const SITE_URL = "https://frederikmeiner.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Frederik Meiner — Senior Frontend Developer",
    // Undersiderne sætter kun deres eget navn; resten lægges på her.
    template: "%s — Frederik Meiner",
  },
  description:
    "Portfolio for Frederik Meiner, senior frontend developer. Projekter, erfaring og kompetencer præsenteret som en Netflix-profil.",
  openGraph: {
    type: "website",
    locale: "da_DK",
    siteName: "Frederik Meiner",
    url: SITE_URL,
    title: "Frederik Meiner — Senior Frontend Developer",
    description:
      "Portfolio for Frederik Meiner, senior frontend developer. Projekter, erfaring og kompetencer præsenteret som en Netflix-profil.",
    images: [{ url: "/Frederik-portraet.jpg", width: 1200, height: 630, alt: "Frederik Meiner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frederik Meiner — Senior Frontend Developer",
    description: "Projekter, erfaring og kompetencer præsenteret som en Netflix-profil.",
    images: ["/Frederik-portraet.jpg"],
  },
  alternates: { canonical: "/" },
};

/**
 * Sætter temaet før browseren maler første frame, så man ikke ser et glimt
 * af det forkerte tema. Kører synkront — derfor inline og ikke en komponent.
 *
 * Mørkt er sidens identitet og dermed standard. Systemets prefers-color-scheme
 * ignoreres med vilje — kun et aktivt valg i temaknappen giver lyst tema.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("fm-theme");
    document.documentElement.dataset.theme = stored === "light" ? "light" : "dark";
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={`${archivo.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
