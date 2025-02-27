import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import process from "node:process";

// Load environment variables from the `.env` file
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "");
  dotenv.config({ path: ".env" });
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_REACT_SERVER_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    },
  };
});

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:4292",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, "/api"),
//       },
//     },
//   },
// });
