import request from 'supertest';
import { WebSocket } from 'ws';

import { webServer } from './app';

describe('GET /', () => {
  test('API Server should be live', async () => {
    const response = await request(webServer).get('/contextium/v0/config/ping');

    expect(response.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body?.ping).toBe(true);
  });

  test('WebSocket Server should be live', async () => {
    // eslint-disable-next-line require-await
    async function waitForWebSocketOpen(ws: WebSocket): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/return-await
      return new Promise((resolve) => ws.on('open', () => resolve()));
    }

    const webSocket = new WebSocket(`ws://localhost:3000/ws`);

    await waitForWebSocketOpen(webSocket);

    expect(webSocket.readyState).toBe(webSocket.OPEN);
  });
});
