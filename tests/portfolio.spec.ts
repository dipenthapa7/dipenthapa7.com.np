import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

test("publishes the essential portfolio content and downloads", async ({
  page,
}) => {
  await expect(page).toHaveTitle("Dipen Thapa — Portfolio")
  await expect(
    page.getByRole("heading", { level: 1, name: "Dipen Thapa" }),
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toHaveAttribute("href", "#main-content")

  const cvLink = page.getByRole("link", {
    name: "Download Dipen Thapa CV as PDF",
  })
  await expect(cvLink).toHaveAttribute("href", "/Dipen-Thapa-CV.pdf")

  const cvResponse = await page.request.get("/Dipen-Thapa-CV.pdf")
  expect(cvResponse.ok()).toBeTruthy()
  expect(cvResponse.headers()["content-type"]).toContain("application/pdf")
})

test("keeps the contact form accessible and protected by a honeypot", async ({
  page,
}) => {
  const form = page.locator('form[action="https://formspree.io/f/meeybzpo"]')
  await expect(form).toBeVisible()
  await expect(page.getByLabel("Name")).toBeVisible()
  await expect(page.getByLabel("Email")).toBeVisible()
  await expect(page.getByLabel("Message")).toBeVisible()
  await expect(form.locator('input[name="_gotcha"]')).toHaveAttribute(
    "tabindex",
    "-1",
  )

  await form.getByRole("button", { name: "Send message" }).click()
  await expect(page.getByLabel("Name")).toBeFocused()
})

test("ships indexable SEO files and a static-host CSP fallback", async ({
  page,
}) => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    page.request.get("/robots.txt"),
    page.request.get("/sitemap.xml"),
  ])

  expect(robotsResponse.ok()).toBeTruthy()
  expect(await robotsResponse.text()).toContain(
    "Sitemap: https://www.dipenthapa7.com.np/sitemap.xml",
  )
  expect(sitemapResponse.ok()).toBeTruthy()
  expect(await sitemapResponse.text()).toContain(
    "<loc>https://www.dipenthapa7.com.np/</loc>",
  )

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index, follow",
  )
  await expect(
    page.locator('meta[http-equiv="Content-Security-Policy"]'),
  ).toHaveAttribute("content", /default-src 'self'/)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://www.dipenthapa7.com.np/og.jpg",
  )
})

test("does not overflow horizontally", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }))

  expect(dimensions.documentWidth).toBeLessThanOrEqual(
    dimensions.viewportWidth + 1,
  )
})

test("opens and closes the mobile navigation accessibly", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1280) >= 768, "Mobile-only behavior")

  const openMenu = page.getByRole("button", { name: "Open navigation menu" })
  await openMenu.click()

  const menu = page.getByRole("dialog", { name: "Main navigation" })
  await expect(menu).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Close navigation menu" }),
  ).toHaveAttribute("aria-expanded", "true")

  await page.keyboard.press("Escape")
  await expect(menu).toBeHidden()
  await expect(openMenu).toBeFocused()
})
