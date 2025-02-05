import WebSocket from 'ws';

import type { GenAiIntegration } from 'src/clients/integrations/genAiIntegration.base';
import logger from 'src/utils/logger';

type IncomingChatMessage = {
  userId: string;
  content: string;
  threadId: string | null;
};

export class ChatController {
  private genAiIntegration: GenAiIntegration;

  constructor(genAiIntegration: GenAiIntegration) {
    this.genAiIntegration = genAiIntegration;
  }

  public async processIncomingChatMessage(
    chatMessage: IncomingChatMessage,
    websocket: WebSocket
  ) {
    // Save in DB;
    logger.info(`Processing Message: ${chatMessage.content}`);

    const streamer = await this.genAiIntegration.queryStream(
      chatMessage.content
    );

    websocket.send(' ');
    websocket.send(' ');
    websocket.send('---');
    websocket.send(' ');
    websocket.send(' ');

    await this.genAiIntegration.processStream(streamer, (data) =>
      websocket.send(data)
    );

    websocket.send(' ');
    websocket.send(' ');
    websocket.send('---');
    websocket.send(' ');
    websocket.send(' ');

    return null;
  }
}
