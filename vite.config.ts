import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // В контейнере на macOS события файловой системы приходят ненадёжно
    watch: { usePolling: true, interval: 300 },
  },
})
