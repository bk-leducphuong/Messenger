import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // allow connections from outside container
    port: 3000,
    cors: true, // enable CORS for development
  },
  plugins: [
    react(),
  ],
  
});
