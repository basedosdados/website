const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.NEXT_PUBLIC_BASE_URL_FRONTEND = process.env.NEXT_PUBLIC_BASE_URL_FRONTEND
      return config
    },
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL_FRONTEND
  },
});
