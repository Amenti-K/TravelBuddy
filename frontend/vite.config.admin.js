import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "src/admin",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174, // Different port than user
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3300",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
