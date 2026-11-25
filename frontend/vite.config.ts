import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Fail instead of silently moving to 5174 when 5173 is taken; `npm run web:stop` targets 5173.
    strictPort: true,
    // In dev, /api/* is forwarded to `sam local start-api` so the browser sees one origin (no CORS).
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
