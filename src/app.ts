import dotenv from 'dotenv';
import express from 'express';
import type { RequestListener } from 'http';

import { ConfigModule } from 'src/modules/config.module';
import { DocumentsModule } from 'src/modules/documents.module';
import logger from 'src/utils/logger';

import { MainRouter, type RouterConfig } from 'src/routes/main.router';
import { BASE_PATHS } from 'src/routes/paths';

import { ApiServer } from 'src/servers/API.server';
import { HttpServer } from 'src/servers/http.server';
import { ChatWebSocketServer } from 'src/servers/webSocket.server';

dotenv.config();

const routers: RouterConfig[] = [
  { path: BASE_PATHS.config, router: new ConfigModule().getRouter() },
  { path: BASE_PATHS.documents, router: new DocumentsModule().getRouter() },
];

const apiApp = express();
const apiRouter = new MainRouter(routers).getRouter();
new ApiServer(apiApp, apiRouter);

const chatWebsocketServer = new ChatWebSocketServer();

export const webServer = new HttpServer(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  apiApp as RequestListener,
  chatWebsocketServer
).getServer();

// Start the server
const SERVER_PORT = process.env.SERVER_PORT || 3000;

webServer
  .listen(SERVER_PORT, () => {
    logger.info(`Server is running on http://localhost:${SERVER_PORT}`);
  })
  .on('error', (err) => {
    logger.error('Error starting server:', err.message);
  });
