import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * "FM"-mærket fra navigationen som ikon: hvidt på accentblå, så det kan ses i
 * både lyse og mørke faner. `radius` er 0 for apple-icon — iOS runder selv.
 */
export async function brandIcon(size: number, radius: number) {
  const bold = await readFile(join(process.cwd(), "src/assets/fonts", "archivo-latin-700-normal.woff"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563eb",
          borderRadius: radius,
          color: "#ffffff",
          fontFamily: "Archivo",
          fontWeight: 700,
          fontSize: size * 0.56,
          letterSpacing: -size * 0.02,
        }}
      >
        FM
      </div>
    ),
    { width: size, height: size, fonts: [{ name: "Archivo", data: bold, weight: 700, style: "normal" }] }
  );
}
