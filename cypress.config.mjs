import { defineConfig } from "cypress";
import "dotenv/config";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env = config.env || {};
      // you could extract only specific variables and rename them if necessary
      config.env.FRONTEND_URL = process.env.VITE_BASE_URL + ":" + process.env.VITE_FRONTEND_PORT;
      config.env.BACKEND_URL = process.env.VITE_BASE_URL + ":" + process.env.VITE_BACKEND_PORT;
      console.log("Extended config.env with process.env");
      return config;
    },
  },
});
