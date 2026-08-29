import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frederik Meiner",
  description: "Senior Frontend Developer — Portfolio",
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
    <html lang="da" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
