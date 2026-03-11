import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Aquí le dices a Vite que "pegue" esta línea al principio de CUALQUIER archivo .scss
        additionalData: `@use "src/assets/base/_variables.scss" as *;`
      }
    }
  }
})
