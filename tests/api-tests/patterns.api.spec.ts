import { expect, test } from '@playwright/test';

test.describe('GET /patterns/search', () => {
  test('returns 200 with paginated results', async ({ request }) => {
    const response = await request.get('patterns/search', {
      params: { q: '', sort: 'recently-popular', page: '1' },
    });

    expect(response.status()).toBe(200);
    // console.log('Response body:', response, await response.json()); // Log the response body for debugging
    const data = await response.json();
    expect(data.patterns).toBeDefined();
    expect(Array.isArray(data.patterns)).toBe(true);
    expect(data.patterns.length).toBeGreaterThan(0);
  });

  test('each pattern has the required list fields', async ({ request }) => {
    const response = await request.get('patterns/search', {
      params: { q: '', sort: 'recently-popular', page: '1' },
    });

    const { patterns } = await response.json();
    const pattern = patterns[0];

    expect(pattern).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      permalink: expect.any(String),
      designer: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
      }),
    });
  });

  test('paginator has correct shape and reflects page 1', async ({ request }) => {
    const response = await request.get('patterns/search', {
      params: { q: '', sort: 'recently-popular', page: '1' },
    });

    const { paginator } = await response.json();

    expect(paginator).toMatchObject({
      page: 1,
      page_size: expect.any(Number),
      page_count: expect.any(Number),
      results: expect.any(Number),
    });
    expect(paginator.results).toBeGreaterThan(0);
  });

  test('filters results by search term', async ({ request }) => {
    const response = await request.get('patterns/search', {
      params: { q: 'hat', sort: 'recently-popular', page: '1' },
    });

    expect(response.status()).toBe(200);

    const { patterns } = await response.json();
    expect(Array.isArray(patterns)).toBe(true);
  });

  test('returns empty list for unmatched term', async ({ request }) => {
    const response = await request.get('patterns/search', {
      params: { q: 'zzzzzzz_no_match_xyzabc_99999', sort: 'recently-popular', page: '1' },
    });

    expect(response.status()).toBe(200);

    const { patterns } = await response.json();
    expect(patterns.length).toBe(0);
  });

  test('page 2 returns a different set of results', async ({ request }) => {
    const [page1, page2] = await Promise.all([
      request
        .get('patterns/search', { params: { q: '', sort: 'recently-popular', page: '1' } })
        .then((r) => r.json()),
      request
        .get('patterns/search', { params: { q: '', sort: 'recently-popular', page: '2' } })
        .then((r) => r.json()),
    ]);

    const ids1 = page1.patterns.map((p: { id: number }) => p.id);
    const ids2 = page2.patterns.map((p: { id: number }) => p.id);
    const overlap = ids1.filter((id: number) => ids2.includes(id));

    expect(overlap.length).toBe(0);
  });
});

test.describe('GET /patterns/:id', () => {
  let patternId: number;

  test.beforeAll(async ({ request }) => {
    const response = await request.get('patterns/search', {
      params: { q: '', sort: 'recently-popular', page: '1' },
    });
    const { patterns } = await response.json();
    patternId = patterns[0].id;
  });

  test('returns 200 with a pattern wrapper', async ({ request }) => {
    const response = await request.get(`patterns/${patternId}`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.pattern).toBeDefined();
    expect(data.pattern.id).toBe(patternId);
  });

  test('detail response has richer fields than list', async ({ request }) => {
    const response = await request.get(`patterns/${patternId}`);
    const { pattern } = await response.json();

    expect(pattern).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      craft: expect.objectContaining({ name: expect.any(String) }),
      pattern_author: expect.objectContaining({ name: expect.any(String) }),
    });
  });

  test('returns error status for non-existent pattern id', async ({ request }) => {
    const response = await request.get('patterns/999999999');
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
