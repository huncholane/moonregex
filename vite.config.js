import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/static": "https://regex101.com",
      "/js": "https://regex101.com",
    },
  },
});
