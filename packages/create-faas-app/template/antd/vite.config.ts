import { viteFaasJsServer, oxfmtConfig, oxlintConfig } from '@faasjs/dev'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [react(), viteFaasJsServer()],
  fmt: oxfmtConfig,
  lint: oxlintConfig,
})
