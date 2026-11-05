import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

vi.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/",
    asPath: "/",
    query: {},
    locale: "pt",
    isReady: true,
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(() => Promise.resolve()),
    events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
  }),
}))

vi.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "pt", changeLanguage: vi.fn() },
  }),
  appWithTranslation: (component) => component,
}))

beforeEach(() => {
  window.gtag = vi.fn()
  window.dataLayer = []
})
