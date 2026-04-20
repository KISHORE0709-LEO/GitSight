import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import dotenv from "dotenv";
import fs from "fs";

// Load .env.local
let apiGatewayUrl = "https://e0kpa6cnrl.execute-api.us-east-1.amazonaws.com";

if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf-8");
  const match = envContent.match(/VITE_API_GATEWAY_URL=(.+)/);
  if (match) {
    apiGatewayUrl = match[1].trim();
  }
}

export default defineConfig(({ mode }) => {
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api": {
          target: apiGatewayUrl,
          changeOrigin: true,
          rewrite: (path) => path,
          secure: false,
        },
        "/pipeline": {
          target: apiGatewayUrl,
          changeOrigin: true,
          rewrite: (path) => path,
          secure: false,
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
