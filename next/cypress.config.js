const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.NEXT_PUBLIC_BASE_URL_FRONTEND = process.env.NEXT_PUBLIC_BASE_URL_FRONTEND
      return config
    },
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL_FRONTEND,
    video: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    chromeWebSecurity: false
  },
  env: {
    CRYPRESS_AUTH_EMAIL: process.env.CRYPRESS_AUTH_EMAIL,
    CRYPRESS_AUTH_PASSWORD: process.env.CRYPRESS_AUTH_PASSWORD
  }
});
