import { defineConfig } from "vitest/config"

export default defineConfig({
  esbuild: {
    loader: "jsx",
    include: /\.js$/,
    exclude: [],
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./__tests__/setup.js"],
    include: ["__tests__/**/*.test.js"],
    coverage: {
      provider: "v8",
      include: ["utils.js", "utils/**/*.js", "lib/**/*.js", "pages/api/**/*.js"],
      reporter: ["text", "html"],
    },
  },
})
