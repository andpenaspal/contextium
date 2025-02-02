import { ContentType, HttpBaseClient } from 'src/clients/http/httpBaseClient';
import { assertIsError } from 'src/utils/error';
import logger from 'src/utils/logger';

export class HttpStreamClient extends HttpBaseClient<ReadableStream<unknown>> {
  protected async processResponse<T>(
    res: Response
  ): Promise<ReadableStream<T> | null> {
    const contentType = res.headers.get('Content-Type');
    if (!contentType) throw new Error('No Content Type');

    logger.info('HERE');
    logger.info(res.body);
    logger.info('HERE');

    // console.dir(res, { depth: null });

    try {
      if (contentType === ContentType.textEventStream)
        return await Promise.resolve(res.body);
    } catch (error: unknown) {
      const msg = `Error Processing Response for Content Type: ${contentType}.`;

      assertIsError(error, msg);

      throw new Error(`${msg} Error: ${error.message}`);
    }

    throw new Error(`Content Type not supported: ${contentType}`);
  }
}
