import request from 'supertest';

import { expressApp } from './app';

describe('GET /', () => {
  it('should return status 200 and a message', async () => {
    const response = await request(expressApp).get(
      '/contextium/v0/config/ping'
    );

    expect(response.status).toBe(200);
    expect(response.body.ping).toBe(true);
  });
});
