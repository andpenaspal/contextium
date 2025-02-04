import WebSocket from 'ws';

import { HuggingFaceIntegration } from 'src/clients/integrations/huggingface.integration';
import logger from 'src/utils/logger';

type IncomingChatMessage = {
  userId: string;
  content: string;
  threadId: string | null;
};

export class ChatController {
  //   private chatService: ChatService;

  //   constructor(chatService: ChatService){
  //     this.chatService = chatService;
  //   }

  public async processIncomingChatMessage(
    chatMessage: IncomingChatMessage,
    websocket: WebSocket
  ) {
    // Save in DB;
    logger.info(`Processing Message: ${chatMessage.content}`);
    const api = new HuggingFaceIntegration();

    const streamer = await api.queryStream(chatMessage.content);

    websocket.send(' ');
    websocket.send(' ');
    websocket.send('---');
    websocket.send(' ');
    websocket.send(' ');

    await api.processStream(streamer, (data) => websocket.send(data));

    websocket.send(' ');
    websocket.send(' ');
    websocket.send('---');
    websocket.send(' ');
    websocket.send(' ');

    return null;
  }
}
