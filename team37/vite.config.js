import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    host: true, // listen on 0.0.0.0 so Docker host can access it
    port: 5173,
    proxy: {
  "/api": {
    target: "http://localhost:3001",
    changeOrigin: true,
    secure: false,
  },
},

  },
});
