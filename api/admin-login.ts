type Request = { method?: string; body?: unknown };
type Response = { setHeader(name: string, value: string): void; status(code: number): Response; json(value: unknown): void };

export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const input = (body && typeof body === "object" ? body : {}) as { username?: unknown; password?: unknown };
  const username = typeof input.username === "string" ? input.username.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const expectedUsername = (process.env.ADMIN_LOGIN_USERNAME || "babieca").trim().toLowerCase();
  if (!username || !password || username !== expectedUsername) {
    return res.status(401).json({ error: "Usuario o contrasena incorrectos." });
  }

  const email = process.env.SUPABASE_TEAM_EMAIL;
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!email || !supabaseUrl || !anonKey) {
    return res.status(503).json({ error: "El inicio de sesion no esta configurado en el servidor." });
  }

  try {
    const authResponse = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: anonKey },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    if (!authResponse.ok) return res.status(401).json({ error: "Usuario o contrasena incorrectos." });
    const authData = await authResponse.json() as { access_token?: string; refresh_token?: string };
    if (!authData.access_token || !authData.refresh_token) {
      return res.status(502).json({ error: "Supabase devolvio una respuesta de sesion incompleta." });
    }
    return res.status(200).json({ access_token: authData.access_token, refresh_token: authData.refresh_token });
  } catch {
    return res.status(502).json({ error: "No se pudo conectar con Supabase. Intentalo de nuevo." });
  }
}
