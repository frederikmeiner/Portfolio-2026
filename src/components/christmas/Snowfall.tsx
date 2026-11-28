/**
 * Stille snefald over hele siden. Ren CSS: ingen JavaScript, ingen canvas,
 * og den rammer hverken klik eller skærmlæsere. Fnuggenes placering er
 * faste tal ud fra indekset, så server og browser renderer det samme.
 */
const FLAKES = Array.from({ length: 28 }, (_, i) => {
  // Deterministisk "tilfældighed" — Math.random ville give hydreringsfejl.
  const r = (n: number) => ((i * 9301 + n * 49297) % 233280) / 233280;
  return {
    left: `${(r(1) * 100).toFixed(2)}%`,
    size: 3 + Math.round(r(2) * 5),
    duration: 9 + r(3) * 12,
    delay: -r(4) * 20,
    drift: Math.round((r(5) - 0.5) * 80),
    opacity: 0.35 + r(6) * 0.5,
  };
});

export default function Snowfall() {
  return (
    <div aria-hidden="true" className="snowfall">
      {FLAKES.map((f, i) => (
        <span
          key={i}
          style={
            {
              left: f.left,
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              animationDuration: `${f.duration.toFixed(1)}s`,
              animationDelay: `${f.delay.toFixed(1)}s`,
              "--drift": `${f.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
