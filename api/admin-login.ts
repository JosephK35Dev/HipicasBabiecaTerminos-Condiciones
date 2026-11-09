import { signInWithTeamUsername } from "../server/admin-login";

type Request = { method?: string; body?: unknown };
type Response = { setHeader(name: string, value: string): void; status(code: number): Response; json(value: unknown): void };

export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const result = await signInWithTeamUsername((body && typeof body === "object" ? body : {}) as { username?: unknown; password?: unknown }, {
    username: process.env.ADMIN_LOGIN_USERNAME,
    email: process.env.SUPABASE_TEAM_EMAIL,
    supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  });
  return res.status(result.status).json(result.body);
}
