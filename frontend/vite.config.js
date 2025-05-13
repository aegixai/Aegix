import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: isProduction
          ? 'https://aegix-api.onrender.com' // 🔁 כתובת ה־Backend שלך ברנדר
          : 'http://localhost:5000',         // 🧪 פיתוח מקומי
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
