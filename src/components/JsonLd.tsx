/**
 * Strukturerede data til søgemaskiner. "<" escapes, så tekst fra Sanity aldrig
 * kan lukke script-tagget og blive til markup.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
