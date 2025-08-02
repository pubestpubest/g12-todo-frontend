import { defineConfig, loadEnv } from "vite";
import type { ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default ({ mode }: ConfigEnv) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const baseUrl = "http://localhost";
  const backendPort = process.env.VITE_BACKEND_PORT || "3000";
  const frontendPort = process.env.VITE_FRONTEND_PORT || "5103";
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: `${baseUrl}:${backendPort}`,
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (_, req, _res) => {
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url
              );
            });
          },
        },
      },
      port: parseInt(frontendPort),
    },
  });
};
