/* eslint-disable @typescript-eslint/naming-convention */
import { HttpBaseClient } from 'src/clients/http/httpBaseClient';
import { assertIsError } from 'src/utils/error';

export const ContentType = {
  applicationJson: 'application/json',
  textPlain: 'text/plain',
  textEventStream: 'text/event-stream',
} as const;

type ContentType = (typeof ContentType)[keyof typeof ContentType];

export class HttpClient extends HttpBaseClient<Promise<unknown>> {
  protected async processResponse<T>(res: Response): Promise<T> {
    const contentType = res.headers.get('Content-Type');
    if (!contentType) throw new Error('No Content Type');

    try {
      if (contentType === ContentType.applicationJson)
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return await (res.json() as T);

      if (contentType === ContentType.textPlain)
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return await (res.text() as T);
    } catch (error: unknown) {
      const msg = `Error Processing Response for Content Type: ${contentType}.`;

      assertIsError(error, msg);

      throw new Error(`${msg} Error: ${error.message}`);
    }

    throw new Error(`Content Type not supported: ${contentType}`);
  }
}
