import { expect, test } from "@playwright/test";

/**
 * Login med engangskode ender i router.refresh(), ikke i en genindlæsning.
 * Ønskelisten skal vise serverens reservationer med det samme — ikke først
 * efter F5. Netop det gik galt, da listerne kun blev læst ind i useState ved
 * første render.
 */
test("reservationer vises straks efter login med e-mailkode", async ({ page }) => {
  await page.goto("/family/wishlist");

  // Udlogget: ingen tæller og ingen reservationsknapper.
  await expect(page.getByText(/reserveret$/)).toHaveCount(0);

  await page.getByRole("button", { name: "Log ind med e-mail" }).click();
  await page.getByPlaceholder("din@mail.dk").fill("gaest@example.com");
  await page.getByPlaceholder("din@mail.dk").press("Enter");
  await page.getByPlaceholder("••••••").fill("123456");
  await page.getByPlaceholder("••••••").press("Enter");

  // Uden reload: to ønsker er taget, og det ene er gæstens eget.
  await expect(page.getByText(/^2 af \d+ reserveret$/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Fortryd" })).toHaveCount(1);

  // Og en genindlæsning må ikke ændre billedet.
  await page.reload();
  await expect(page.getByText(/^2 af \d+ reserveret$/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Fortryd" })).toHaveCount(1);
});

test("ukendte sider får 404-siden, og forsiden til en profil svarer", async ({ page }) => {
  const missing = await page.goto("/findes-ikke");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Faret vild?" })).toBeVisible();

  const home = await page.goto("/developer");
  expect(home?.status()).toBe(200);
  await expect(page.getByText(/^Top 10/)).toBeVisible();
});
