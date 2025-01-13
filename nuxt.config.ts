// nuxt.config.ts
export default defineNuxtConfig({
  // ติดตั้ง Bootstrap CSS
  css: ['bootstrap/dist/css/bootstrap.min.css'],

  // Transpile Bootstrap
  build: {
    transpile: ['bootstrap']
  },
  
  // กำหนดการใช้ Plugins หรือ Module อื่น ๆ
  plugins: ['~/plugins/bootstrap.client.ts'],

  compatibilityDate: '2025-01-12'
})