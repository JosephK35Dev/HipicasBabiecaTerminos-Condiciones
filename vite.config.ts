import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { signInWithTeamUsername } from "./server/admin-login.ts";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), {
      name: "babieca-admin-login-dev",
      configureServer(server) {
        server.middlewares.use("/api/admin-login", (req, res) => {
          res.setHeader("Cache-Control", "no-store, max-age=0");
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: "Método no permitido." }));
            return;
          }
          let raw = "";
          req.setEncoding("utf8");
          req.on("data", (chunk: string) => { raw += chunk; });
          req.on("end", async () => {
            let input: { username?: unknown; password?: unknown } = {};
            try { input = JSON.parse(raw); } catch { /* Return a normal invalid-login response. */ }
            const result = await signInWithTeamUsername(input, {
              username: env.ADMIN_LOGIN_USERNAME,
              email: env.SUPABASE_TEAM_EMAIL,
              supabaseUrl: env.VITE_SUPABASE_URL || env.SUPABASE_URL,
              anonKey: env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY,
            });
            res.statusCode = result.status;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify(result.body));
          });
        });
      },
    }],
  };
});
