import { viteFaasJsServer } from '@faasjs/dev'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [react(), viteFaasJsServer()],
})
