"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";
import Modal from "@/components/ui/Modal";
import { getBrowserSupabase } from "@/lib/supabase/client";

/** Skal matche `mailer_otp_length` i Supabase' auth-konfiguration. */
const CODE_LENGTH = 6;

type Step = "email" | "code";

type Props = {
  open: boolean;
  onClose: () => void;
};

function describe(error: AuthError) {
  switch (error.code) {
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "For mange forsøg på kort tid. Vent et øjeblik, og prøv igen.";
    case "otp_expired":
      return "Koden er forkert eller udløbet. Tjek den igen, eller bed om en ny.";
    case "email_address_invalid":
    case "validation_failed":
      return "Det ligner ikke en gyldig e-mailadresse.";
    default:
      return "Noget gik galt. Prøv igen.";
  }
}

const fieldStyle = {
  background: "var(--surface)",
  color: "var(--foreground)",
  border: "1px solid var(--border)",
  fontFamily: "var(--font-body)",
} as const;

/**
 * Login med e-mail og engangskode — for gæster uden Google-konto.
 *
 * En kode man taster ind slår et link i mailen: Outlooks "Safe Links" åbner
 * links på forhånd og bruger dem op, og et link fejler når mailen åbnes i en
 * anden browser end den der bad om det. Koden virker overalt og kræver ingen
 * redirect.
 */
export default function EmailSignIn({ open, onClose }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Modal'en lægger selv fokus på panelet når den åbner — flyt det videre til
  // feltet bagefter, så man kan skrive med det samme.
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, [open, step]);

  function close() {
    onClose();
    setStep("email");
    setCode("");
    setError(null);
  }

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await getBrowserSupabase().auth.signInWithOtp({ email: email.trim() });
    setBusy(false);
    if (error) {
      setError(describe(error));
      return;
    }
    setStep("code");
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await getBrowserSupabase().auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });
    setBusy(false);
    if (error) {
      setError(describe(error));
      return;
    }
    close();
    router.refresh();
  }

  return (
    <Modal open={open} onClose={close} title={step === "email" ? "Log ind med e-mail" : "Tjek din indbakke"}>
      {step === "email" ? (
        <form onSubmit={sendCode} className="flex w-full flex-col gap-3">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            Vi sender en {CODE_LENGTH}-cifret kode til din adresse. Ingen adgangskode, ingen konto.
          </p>
          <input
            ref={inputRef}
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="din@mail.dk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-base outline-none focus:ring-2"
            style={fieldStyle}
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full cursor-pointer rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-60"
            style={{ background: "var(--accent)", color: "#fff", fontFamily: "var(--font-body)" }}
          >
            {busy ? "Sender…" : "Send kode"}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="flex w-full flex-col gap-3">
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            Vi har sendt en kode til{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{email.trim()}</span>. Kig også i
            spam, hvis den lader vente på sig.
          </p>
          <input
            ref={inputRef}
            type="text"
            name="code"
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern={`[0-9]{${CODE_LENGTH}}`}
            maxLength={CODE_LENGTH}
            placeholder={"•".repeat(CODE_LENGTH)}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded-xl px-4 py-3 text-center text-2xl font-semibold tracking-[0.4em] outline-none focus:ring-2"
            style={fieldStyle}
          />
          <button
            type="submit"
            disabled={busy || code.length !== CODE_LENGTH}
            className="w-full cursor-pointer rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-60"
            style={{ background: "var(--accent)", color: "#fff", fontFamily: "var(--font-body)" }}
          >
            {busy ? "Tjekker…" : "Log ind"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
            className="cursor-pointer text-xs underline underline-offset-2 hover:opacity-70"
            style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            Anden adresse eller ny kode
          </button>
        </form>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 w-full rounded-xl px-4 py-2.5 text-sm"
          style={{
            background: "color-mix(in srgb, #ef4444 10%, transparent)",
            border: "1px solid color-mix(in srgb, #ef4444 35%, transparent)",
            color: "var(--foreground)",
            fontFamily: "var(--font-body)",
          }}
        >
          {error}
        </p>
      )}
    </Modal>
  );
}
