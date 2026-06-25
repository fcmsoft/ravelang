import { expect, test, type Page } from '@playwright/test';

const anemoiaListPattern = {
  id: 7537062,
  name: 'Anemoia',
  designer: {
    id: 78156,
    name: 'Andrea Mowry',
  },
  first_photo: {
    id: 1,
    small_url: 'https://images.example.com/anemoia-small.jpg',
  },
};

const seaFoamListPattern = {
  id: 7536854,
  name: 'Sea Foam Tee',
  designer: {
    id: 41000,
    name: 'Joji Locatelli',
  },
  first_photo: {
    id: 2,
    small_url: 'https://images.example.com/sea-foam-small.jpg',
  },
};

const anemoiaDetailPattern = {
  id: 7537062,
  name: 'Anemoia',
  notes_html: '<p>Mocked detail notes for deterministic Playwright coverage.</p>',
  published: '2026-06-01T00:00:00.000Z',
  pattern_author: {
    id: 78156,
    name: 'Andrea Mowry',
  },
  photos: [
    {
      id: 100,
      medium2_url: 'https://images.example.com/anemoia-medium-1.jpg',
    },
    {
      id: 101,
      medium2_url: 'https://images.example.com/anemoia-medium-2.jpg',
    },
  ],
  first_photo: {
    id: 100,
    small_url: 'https://images.example.com/anemoia-small.jpg',
  },
  pattern_attributes: [
    { id: 1, permalink: 'textured' },
    { id: 2, permalink: 'seamless' },
  ],
  craft: {
    id: 1,
    name: 'Knitting',
    permalink: 'knitting',
  },
  pattern_categories: [{ id: 1, name: 'Shawl / Wrap' }],
  favorites_count: 593,
  projects_count: 6,
  sizes_available: 'One (adjustable)',
  languages: [{ id: 1, name: 'English' }],
  yarn_weight_description: 'DK (11 wpi)',
  gauge_description: '21 stitches and 30 rows = 4 inches',
  pattern_needle_sizes: [{ id: 1, name: 'US 7 - 4.5 mm' }],
  yardage_description: '750 - 800 yards',
  packs: [{ yarn_id: 205303, yarn_name: 'La Bien Aimee Corrie Worsted' }],
};

async function mockLoggedOutSession(page: Page): Promise<void> {
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized' }),
    });
  });
}

async function mockPatternsApi(page: Page): Promise<void> {
  await page.route('**/api/patterns/search**', async (route) => {
    const url = new URL(route.request().url());
    const query = (url.searchParams.get('q') ?? '').toLowerCase().trim();
    const requestedPage = Number(url.searchParams.get('page') ?? '1');
    const isAnemoiaSearch = query.includes('anemoia');

    const patterns =
      requestedPage > 1
        ? []
        : isAnemoiaSearch
          ? [anemoiaListPattern]
          : [anemoiaListPattern, seaFoamListPattern];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        patterns,
        paginator: {
          page: requestedPage,
          page_size: 20,
          page_count: 1,
          results: patterns.length,
          sort: url.searchParams.get('sort') ?? 'recently-popular',
        },
      }),
    });
  });

  await page.route('**/api/patterns/7537062', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ pattern: anemoiaDetailPattern }),
    });
  });
}

test.describe('Stable flows with mocked APIs', () => {
  test.beforeEach(async ({ page }) => {
    await mockLoggedOutSession(page);
    await mockPatternsApi(page);
  });

  test('shows home hero for logged-out users', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Raverlang Home Page');
    await expect(page.getByRole('heading', { name: 'Raverlang' })).toBeVisible();
    await expect(page.getByTestId('auth-login-button')).toBeVisible();
    await expect(page.getByTestId('nav-patterns-link')).toBeVisible();
  });

  test('navigates to patterns and filters deterministically', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('nav-patterns-link').click();
    await expect(page).toHaveURL(/\/patterns$/);
    await expect(page.getByRole('heading', { name: 'Anemoia' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sea Foam Tee' })).toBeVisible();

    await page.getByTestId('patterns-search-input').fill('anemoia');

    await expect(page.getByRole('heading', { name: 'Anemoia' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sea Foam Tee' })).toHaveCount(0);
    await expect(page.getByTestId('patterns-end-message')).toContainText("You've reached the end");
  });

  test('opens mocked pattern details from the list', async ({ page }) => {
    await page.goto('/patterns');

    await page.getByTestId('patterns-search-input').fill('anemoia');
    await page.getByTestId('pattern-card-7537062').click();

    await expect(page).toHaveURL(/\/patterns\/7537062$/);
    await expect(page.getByTestId('pattern-details-page')).toBeVisible();
    await expect(page.getByTestId('pattern-details-title')).toHaveText('Anemoia');
    await expect(page.getByTestId('pattern-designer-link')).toHaveText('Andrea Mowry');
    await expect(page.getByTestId('pattern-details-notes')).toContainText('Mocked detail notes');
  });
});
