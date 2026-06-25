import { expect, test } from '@playwright/test';

test.describe('GET /auth/me', () => {
  test('returns 401 when no session exists', async ({ request }) => {
    const response = await request.get('auth/me');
    expect(response.status()).toBe(401);
  });
});

test.describe('GET /patterns/favorites', () => {
  test('returns 401 when not authenticated', async ({ request }) => {
    const response = await request.get('patterns/favorites');
    expect(response.status()).toBe(401);
  });
});

test.describe('POST /auth/logout', () => {
  test('returns 200 and succeeds even without an active session', async ({ request }) => {
    const response = await request.post('auth/logout');
    // Logout should be idempotent — no session to destroy is not an error
    expect(response.status()).toBe(200);
  });
});
