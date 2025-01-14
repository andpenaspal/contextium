import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import WebSocket, { WebSocketServer } from 'ws';

import logger from 'src/utils/logger';

export class ChatWebSocketServer {
  private webSocketServer: WebSocketServer;

  constructor() {
    this.webSocketServer = new WebSocketServer({ noServer: true });
    this.initializeWebSocket();
    logger.info('TEST - ChatWebSocketServer Constructor');
  }

  public handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
    this.webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
      logger.info('Upgrading Connection to WebSocket');

      this.webSocketServer.emit('connection', webSocket, request);
    });
  }

  private initializeWebSocket() {
    logger.info('Initializing WebSocket');

    this.webSocketServer.on('connection', (webSocket) => {
      logger.info('WebSocket connection established');

      this.configureWebSocket(webSocket);

      webSocket.send('Welcome to the WebSocket server!');
    });
  }

  private configureWebSocket(webSocket: WebSocket) {
    logger.info('Configuring Websocket Behavior');

    webSocket.on('message', this.onMessageConfig(webSocket));
    webSocket.on('close', this.onCloseConfig());
  }

  private onMessageConfig(webSocket: WebSocket) {
    const onMessage = (message: WebSocket.RawData) => {
      const decodedMessage =
        message instanceof Buffer
          ? message.toString().trim()
          : JSON.stringify(message);

      logger.info('Message Received in WebSocket', {
        message: decodedMessage,
      });

      webSocket.send(`Echo: ${decodedMessage}`);
    };

    return onMessage;
  }

  private onCloseConfig() {
    const onClose = () => {
      logger.info('Closing WebSocket');
    };

    return onClose;
  }

  // TODO: Delete
  public getInstance() {
    return this.webSocketServer;
  }
}
