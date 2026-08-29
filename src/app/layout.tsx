import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frederik Meiner",
  description: "Senior Frontend Developer — Portfolio",
};

/**
 * Sætter temaet før browseren maler første frame, så man ikke ser et glimt
 * af det forkerte tema. Kører synkront — derfor inline og ikke en komponent.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("fm-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = theme;
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
