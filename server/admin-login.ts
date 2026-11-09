export type LoginConfig = {
  username?: string;
  email?: string;
  supabaseUrl?: string;
  anonKey?: string;
};

export async function signInWithTeamUsername(
  input: { username?: unknown; password?: unknown },
  config: LoginConfig,
) {
  const expectedUsername = (config.username || "babieca").trim().toLowerCase();
  const suppliedUsername = typeof input.username === "string" ? input.username.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!suppliedUsername || !password || suppliedUsername !== expectedUsername) {
    return { status: 401, body: { error: "Usuario o contraseña incorrectos." } };
  }
  if (!config.email || !config.supabaseUrl || !config.anonKey) {
    return { status: 503, body: { error: "El inicio de sesión no está configurado en el servidor." } };
  }

  try {
    const response = await fetch(`${config.supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: config.anonKey },
      body: JSON.stringify({ email: config.email, password }),
      cache: "no-store",
    });
    if (!response.ok) return { status: 401, body: { error: "Usuario o contraseña incorrectos." } };
    const data = await response.json() as { access_token?: string; refresh_token?: string };
    if (!data.access_token || !data.refresh_token) {
      return { status: 502, body: { error: "Supabase devolvió una respuesta de sesión incompleta." } };
    }
    return { status: 200, body: { access_token: data.access_token, refresh_token: data.refresh_token } };
  } catch {
    return { status: 502, body: { error: "No se pudo conectar con Supabase. Inténtalo de nuevo." } };
  }
}
