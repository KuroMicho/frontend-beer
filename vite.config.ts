import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), react(), tsconfigPaths()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".ngrok-free.app",
      "d3fa-204-157-146-2.ngrok-free.app",
    ],
  },
});
