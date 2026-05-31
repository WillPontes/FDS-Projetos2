/// <reference types="node" />
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const apiTarget = env.VITE_API_URL || "http://localhost:8000";

  return {
  plugins: [tanstackRouter(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.join(rootDir, "src"),
      "@/features": path.join(rootDir, "src/features"),
    },
  },
  server: {
    proxy: {
      "/api": { target: apiTarget, changeOrigin: true },
    },
  },
};
});
