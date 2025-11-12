process.env.NODE_ENV = 'test';

const { create, redirect } = require('../src/handler');

describe('handler', () => {
  test('create then redirect', async () => {
    const eventCreate = { body: JSON.stringify({ url: 'https://example.com' }) };
    const res = await create(eventCreate);
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('shortUrl');

    const id = body.id;
    const eventRedirect = { pathParameters: { id } };
    const res2 = await redirect(eventRedirect);
    expect(res2.statusCode).toBe(301);
    expect(res2.headers).toHaveProperty('Location', 'https://example.com');
  });

  test('create missing url returns 400', async () => {
    const res = await create({ body: JSON.stringify({}) });
    expect(res.statusCode).toBe(400);
  });
});
