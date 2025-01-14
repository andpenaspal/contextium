import dotenv from 'dotenv';
import type { RequestListener } from 'http';

import logger from 'src/utils/logger';

import { MainRouter, type RouterConfig } from 'src/routes/main.router';
import { BASE_PATHS } from 'src/routes/paths';
import { ConfigRouter } from 'src/routes/routers/config.router';

import { ApiServer } from 'src/servers/API.server';
import { HttpServer } from 'src/servers/http.server';
import { ChatWebSocketServer } from 'src/servers/webSocket.server';

dotenv.config();

const routers: RouterConfig[] = [
  { path: BASE_PATHS.config, router: new ConfigRouter() },
];

const apiRouter = new MainRouter(routers).getRouter();
const apiServer = new ApiServer(apiRouter).getApiServerInstance();

const chatWebsocketServer = new ChatWebSocketServer();

export const webServer = new HttpServer(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  apiServer as RequestListener,
  chatWebsocketServer
).getServer();

// Start the server
const SERVER_PORT = process.env.SERVER_PORT || 3000;

webServer.listen(SERVER_PORT, () => {
  logger.info(`Server is running on http://localhost:${SERVER_PORT}`);
});
// .on('error', (err) => {
//   console.error('Error starting server:', err.message);
// });
