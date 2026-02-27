import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "chatbot",
      filename: "remoteEntry.js",
      exposes: {
        "./Chatbot": "./src/Chatbot",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: { polyfill: false },
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
