import { defineConfig, loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    server: {
      https: true,
      proxy: {
        "/omni": {
          target: env.VITE_INCODE_API_URL,
          changeOrigin: true,
        },
      },
      host: true,
    },
    plugins: [mkcert()],
  });
};
