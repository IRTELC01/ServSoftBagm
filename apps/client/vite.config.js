import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    strictPort: true,
  },
  // Ensure CSS is processed correctly with Tailwind v4 PostCSS plugin
  css: {
    postcss: './postcss.config.cjs',
  },
})
