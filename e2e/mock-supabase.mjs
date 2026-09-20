/**
 * En falsk Supabase til browser-testen: lige præcis de kald ønskelisten laver.
 * Login lykkes altid, og to ønsker er reserveret — ét af den indloggede selv.
 *
 * Ønskernes id'er hentes fra Sanity ved opstart, så de matcher de dokumenter
 * siden selv viser. Datasættet er offentligt — der skal ingen nøgle til.
 */
import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_SUPABASE_PORT ?? 54999);

const SANITY = "https://er2djct5.api.sanity.io/v2025-05-23/data/query/production";
const query = encodeURIComponent('*[_type == "wish"] | order(orderRank asc)[0..1]._id');
const { result } = await (await fetch(`${SANITY}?query=${query}`)).json();
if (!Array.isArray(result) || result.length < 2) throw new Error("mock-supabase: fandt ikke to ønsker i Sanity");
const [mine, taken] = result;

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const exp = Math.floor(Date.now() / 1000) + 3600;
const user = {
  id: "11111111-1111-4111-8111-111111111111",
  aud: "authenticated",
  role: "authenticated",
  email: "gaest@example.com",
  user_metadata: { full_name: "Test Gæst" },
  app_metadata: { provider: "email" },
  created_at: new Date().toISOString(),
};
const accessToken = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: user.id, email: user.email, role: "authenticated", aud: "authenticated", exp })}.signatur`;
const session = { access_token: accessToken, token_type: "bearer", expires_in: 3600, expires_at: exp, refresh_token: "refresh", user };

const routes = {
  "POST /auth/v1/otp": () => ({}),
  "POST /auth/v1/verify": () => session,
  "POST /auth/v1/token": () => session,
  "GET /auth/v1/user": () => user,
  "POST /auth/v1/logout": () => ({}),
  "POST /rest/v1/rpc/is_wishlist_owner": () => false,
  "POST /rest/v1/rpc/wishlist_hide_from_owner": () => true,
  "POST /rest/v1/rpc/reserved_wish_ids": () => [mine, taken],
  "GET /rest/v1/reservations": () => [{ wish_id: mine }],
  "GET /rest/v1/rpc/top_project_slugs": () => [],
  "POST /rest/v1/rpc/track_project_view": () => null,
};

createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*");
  res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] ?? "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.writeHead(204).end();
  if (pathname === "/health") return res.writeHead(200).end("ok");

  const handler = routes[`${req.method} ${pathname}`];
  if (!handler) {
    console.error("mock-supabase: ukendt kald", req.method, pathname);
    return res.writeHead(404, { "Content-Type": "application/json" }).end(JSON.stringify({ message: "not mocked" }));
  }
  req.resume().on("end", () => {
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(handler()));
  });
}).listen(PORT, "127.0.0.1", () => console.log(`mock-supabase lytter på ${PORT}`));
