import { createServer, type RequestListener, type Server } from 'http';

import logger from 'src/utils/logger';

import type { ChatWebSocketServer } from 'src/servers/webSocket.server';

export class HttpServer {
  private httpServer: Server;

  constructor(
    apiServer: RequestListener,
    webSocketServer: ChatWebSocketServer
  ) {
    const httpServer = createServer(apiServer);
    this.configureOnUpgrade(httpServer, webSocketServer);

    this.httpServer = httpServer;
  }

  private configureOnUpgrade(
    httpServer: Server,
    webSocketServer: ChatWebSocketServer
  ) {
    httpServer.on('request', (req) => {
      logger.info(`HTTP Request received: ${req.url}`);
    });

    httpServer.on('upgrade', (request, socket, head) => {
      logger.info('TEST - on Upgrade 2');

      // Upgrade to WebSocket
      logger.info('Request to Upgrade connection received');
      if (request.url === '/ws') {
        logger.info('Request to Upgrade Connection accepted');
        webSocketServer.handleUpgrade(request, socket, head);
      } else {
        logger.info('Request to Upgrade Connection rejected');
        socket.destroy();
      }
    });
  }

  public getServer() {
    return this.httpServer;
  }
}
