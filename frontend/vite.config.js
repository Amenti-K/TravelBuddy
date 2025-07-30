import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Enables access from LAN/mobile
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
