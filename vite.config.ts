import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import PostcssPresetEnv from 'postcss-preset-env'
import path from 'path'
import AutoImport from "unplugin-auto-import/vite"

let baseURL: string | undefined;
if (process.env.NODE_ENV === 'development') { 
  baseURL = 'http://localhost:3000';
}
 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    AutoImport({
      dts: "src/vite-auto-imports.d.ts",
      imports: ["vue"],
    }),
  ],
  css: {
    postcss: {
      plugins: [PostcssPresetEnv()],
    },
    preprocessorOptions: {
      scss: {
        additionalData: "@import '@/styles/var.scss';",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
    },
  },
  server: {
    open: true,
    port: 8080,
    proxy: {
      "/api": {
        target: "http://47.94.89.56",
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
  define: {
    "process.env": {
      baseURL
    }
  }
});
