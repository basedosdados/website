const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.NEXT_PUBLIC_BASE_URL_FRONTEND = process.env.NEXT_PUBLIC_BASE_URL_FRONTEND

      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--disable-features=IsolateOrigins,site-per-process");
          launchOptions.args.push("--disable-site-isolation-trials");
          launchOptions.args.push("--disable-web-security");
          launchOptions.args.push("--window-size=1920,1080");
          launchOptions.args.push("--force-device-scale-factor=1");
        }
        return launchOptions;
      });

      return config;
    },
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL_FRONTEND,
    video: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 120000,
    retries: {
      runMode: 1,
      openMode: 0,
    },
  },
  env: {
    CRYPRESS_AUTH_EMAIL: process.env.CRYPRESS_AUTH_EMAIL,
    CRYPRESS_AUTH_PASSWORD: process.env.CRYPRESS_AUTH_PASSWORD
  }
});
