import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: "src/mock", // 指向mock数据目录
      localEnabled: true,   // 开发环境启用mock
      watchFiles: true,     // 监听mock文件变化
      logger: true,         // 启用日志
      // 关键配置：确保mock服务处理所有/api开头的请求
      injectCode: `
        import { setupProdMockServer } from './src/mock';
        setupProdMockServer();
      `,
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // 添加代理配置，解决开发环境API请求问题
    proxy: {
      '/api': {
        target: 'http://localhost:5173', // 指向开发服务器自身
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
});