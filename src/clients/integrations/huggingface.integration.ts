import { ContentType, HttpClient } from 'src/clients/http/httpClient';
import { HttpStreamClient } from 'src/clients/http/httpStreamClient';
import { GenAiIntegration } from 'src/clients/integrations/genAiIntegration.base';
import { assertIsError } from 'src/utils/error';
import logger from 'src/utils/logger';

export type StreamResponse = {
  object: string;
  id: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: {
    index: number;
    delta: { role: string; content: string };
    logprobs: unknown;
    finish_reason?: string;
  }[];
  usage: unknown;
};

type QueryResponse = {
  object: string;
  id: string;
  created: string;
  model: string;
  system_fingerprint: string;
  choices: {
    index: number;
    message: { role: string; content: string };
    log_probs: unknown;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export class HuggingFaceIntegration extends GenAiIntegration {
  constructor() {
    const baseUrl = 'https://api-inference.huggingface.co';
    const queryModel = 'google/gemma-2-2b-it';
    const queryUrl = `/models/${queryModel}/v1/chat/completions`;
    const embeddingsUrl =
      '/pipeline/feature-extraction/sentence-transformers/all-mpnet-base-v2';
    const apiToken = process.env.HUGGING_FACE_API_TOKEN;

    super(baseUrl, queryModel, queryUrl, embeddingsUrl, apiToken);
  }

  public async queryStream(query: string): Promise<ReadableStream<Uint8Array>> {
    const data = {
      model: this.queryModel,
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
      // max_tokens: 500,
      stream: true,
    };

    const stream = await new HttpStreamClient({
      url: this.queryUrl,
    })
      .addContentType(ContentType.applicationJson)
      .addBearerAuth(this.apiToken)
      .addBody(data)
      .addMethod('POST')
      .request<Uint8Array>();

    if (!stream) throw new Error();

    return stream;
  }

  public async processStream(
    stream: ReadableStream<Uint8Array>,
    onChunk?: (content: string) => void
  ): Promise<string> {
    // TODO: Improve this monstrosity.
    let fullContent = '';
    let partialResponse = '';
    let isDone = false;
    const reader = stream.getReader();
    let oldIncomplete = '';

    const getData = (data: string): [string, string] => {
      const delimiter = 'data: {';
      const newData = data;
      const indexLastDelimiter = newData.lastIndexOf(delimiter);

      const newCompleteData = newData.slice(0, indexLastDelimiter);
      const possiblyIncompleteEndData = newData.slice(indexLastDelimiter);

      return [newCompleteData.trim(), possiblyIncompleteEndData.trim()];
    };

    while (!isDone) {
      const { value, done: isStreamDone } = await reader.read();
      isDone = isStreamDone;

      const decoder = new TextDecoder();

      const decoded = decoder.decode(value, { stream: true });

      const [chunkData, incompleteData] = getData(decoded);

      const newContent = oldIncomplete + chunkData;

      oldIncomplete = incompleteData;

      if (!newContent) continue;

      let jsonString = newContent
        // 'data: [DONE]' on end of Stream
        .replace(/data: \[DONE\]/, '')
        .replace(/data:\s?/gm, ',');

      if (jsonString.startsWith(',')) jsonString = jsonString.slice(1);

      const jsonArray = `[${jsonString}]`;

      try {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const parsedData = JSON.parse(jsonArray) as StreamResponse[];

        const responseContent = parsedData
          .map((chunk) =>
            chunk.choices.map((choice) => choice.delta.content).join('')
          )
          .join('');

        if (responseContent) {
          partialResponse = partialResponse + responseContent;

          if (responseContent.endsWith('\n')) {
            if (onChunk) onChunk(partialResponse);
            fullContent = fullContent + partialResponse;
            partialResponse = '';
          }
        }
      } catch (jsonError) {
        logger.error('Failed to parse JSON', {
          error: jsonError,
          jsonArray,
          jsonString,
          newContent,
        });

        throw jsonError;
      }
    }

    return fullContent;
  }

  public async query(query: string) {
    try {
      const data = {
        model: this.queryModel,
        messages: [
          {
            role: 'user',
            content: query,
          },
        ],
      };

      logger.info(`Performing a Query to ${this.queryUrl}`);

      const queryResponse = await new HttpClient({
        url: this.queryUrl,
      })
        .addContentType(ContentType.applicationJson)
        .addBearerAuth(this.apiToken)
        .addBody(data)
        .addMethod('POST')
        .request<QueryResponse>();

      return queryResponse.choices[0]?.message.content;
    } catch (error) {
      const msg = `while trying to Query HuggingFace`;
      assertIsError(error, msg);
      logger.error(`Something went wrong ${msg}. Error: ${error.message}`);
      throw error;
    }
  }

  public async generateEmbeddings(content: string[]): Promise<number[][]> {
    logger.info(`Generating Embeddings`);

    const data = { inputs: content };

    try {
      const embeddings = await new HttpClient({
        url: this.embeddingsUrl,
      })
        .addContentType(ContentType.applicationJson)
        .addBearerAuth(this.apiToken)
        .addBody(data)
        .addMethod('POST')
        .request<number[][]>();

      logger.info('Embeddings generated successfully');

      return embeddings;
    } catch (error) {
      const msg = 'while trying to generate Embeddings';
      assertIsError(error);
      logger.error(
        `Something went wrong ${msg}. Error: ${error.message}. Content ${content[0]?.slice(0, 100)}...`
      );
      throw error;
    }
  }
}
