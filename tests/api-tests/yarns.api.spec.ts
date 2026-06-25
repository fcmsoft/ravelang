import { expect, test } from '@playwright/test';

test.describe('GET /yarns/search', () => {
  test('returns 200 with paginated results', async ({ request }) => {
    const response = await request.get('yarns/search', {
      params: { q: '', page: '1' },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data.yarns)).toBe(true);
    expect(data.yarns.length).toBeGreaterThan(0);
  });

  test('each yarn summary has the required list fields', async ({ request }) => {
    const response = await request.get('yarns/search', {
      params: { q: '', page: '1' },
    });

    const { yarns } = await response.json();
    const yarn = yarns[0];

    expect(yarn).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      permalink: expect.any(String),
    });
    // yarn_company_name is the flat string field returned by the search endpoint
    expect(typeof yarn.yarn_company_name).toBe('string');
  });

  test('paginator has correct shape', async ({ request }) => {
    const response = await request.get('yarns/search', {
      params: { q: '', page: '1' },
    });

    const { paginator } = await response.json();

    expect(paginator).toMatchObject({
      page: 1,
      page_size: expect.any(Number),
      page_count: expect.any(Number),
      results: expect.any(Number),
    });
  });

  test('filters results by search term', async ({ request }) => {
    const response = await request.get('yarns/search', {
      params: { q: 'merino', page: '1' },
    });

    expect(response.status()).toBe(200);

    const { yarns } = await response.json();
    expect(Array.isArray(yarns)).toBe(true);
  });

  test('returns empty list for unmatched term', async ({ request }) => {
    const response = await request.get('yarns/search', {
      params: { q: 'zzzzzzz_no_match_xyzabc_99999', page: '1' },
    });

    expect(response.status()).toBe(200);

    const { yarns } = await response.json();
    expect(yarns.length).toBe(0);
  });
});

test.describe('GET /yarns/:id', () => {
  let yarnId: number;

  test.beforeAll(async ({ request }) => {
    const response = await request.get('yarns/search', {
      params: { q: '', page: '1' },
    });
    const { yarns } = await response.json();
    yarnId = yarns[0].id;
  });

  test('returns 200 with a yarn wrapper', async ({ request }) => {
    const response = await request.get(`yarns/${yarnId}`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.yarn).toBeDefined();
    expect(data.yarn.id).toBe(yarnId);
  });

  test('detail has yarn_company as an object (not a flat string)', async ({ request }) => {
    const response = await request.get(`yarns/${yarnId}`);
    const { yarn } = await response.json();

    // Detail endpoint returns the full yarn_company object
    expect(yarn.yarn_company).toBeDefined();
    expect(yarn.yarn_company).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      permalink: expect.any(String),
    });
  });

  test('detail includes fiber and weight information', async ({ request }) => {
    const response = await request.get(`yarns/${yarnId}`);
    const { yarn } = await response.json();

    expect(yarn.yarn_weight).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
    });
    expect(Array.isArray(yarn.yarn_fibers)).toBe(true);
  });

  test('returns error status for non-existent yarn id', async ({ request }) => {
    const response = await request.get('yarns/999999999');
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('GET /yarns/weights', () => {
  test('returns a list of yarn weights', async ({ request }) => {
    const response = await request.get('yarns/weights');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.yarn_weights).toBeDefined();
    expect(Array.isArray(data.yarn_weights)).toBe(true);
    expect(data.yarn_weights.length).toBeGreaterThan(0);
  });

  test('each yarn weight has required fields', async ({ request }) => {
    const response = await request.get('yarns/weights');
    const { yarn_weights } = await response.json();
    const weight = yarn_weights[0];

    expect(weight).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      ply: expect.any(String),
      wpi: expect.any(String),
    });
  });
});
