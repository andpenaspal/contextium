/* eslint-disable @typescript-eslint/naming-convention */
import { assertIsError } from 'src/utils/error';
import logger from 'src/utils/logger';

export const ContentType = {
  applicationJson: 'application/json',
  textPlain: 'text/plain',
  textEventStream: 'text/event-stream',
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export type RequestResponse = Promise<unknown> | ReadableStream<unknown>;
export type ConditionalRequestResponse<
  P extends RequestResponse,
  T extends object | string,
> = Promise<P extends Promise<unknown> ? T : ReadableStream<T> | null>;

export abstract class HttpBaseClient<P extends RequestResponse> {
  private url: string | undefined;
  private config: RequestInit | undefined;

  constructor(init: Partial<RequestInit & { url: string }> = {}) {
    const { url, headers, ...initConfig } = init;
    this.url = url;
    this.config = { ...initConfig, headers: new Headers(headers) };
  }

  public async request<T extends object | string>(
    url?: string,
    config?: RequestInit
  ): ConditionalRequestResponse<P, T> {
    try {
      const apiUrl = url ?? this.url;
      const apiConfig = config ?? this.config;

      if (!apiUrl) throw new Error('No Url for Fetch Call');

      logger.info(`Performing API Call to: ${apiUrl}`);

      const res = await fetch(apiUrl, apiConfig);

      if (!res.ok) {
        const { status, statusText, headers } = res;
        const body = await res.json();

        logger.error(
          `Unsuccessful Response ${status}: ${statusText}: ${JSON.stringify(body)}. ${JSON.stringify(headers)}`
        );

        throw new Error('Unsuccessful Response', {
          cause: { status, statusText, body },
        });
      }

      return await this.processResponse<T>(res);
    } catch (error) {
      assertIsError(error);
      if (!(error.cause instanceof Response))
        throw new Error(
          `API Call failed with an Unknown Error: ${JSON.stringify(error)}`
        );

      logger.error(
        `API Call failed with status: ${error.cause.status}. Error: ${JSON.stringify(error.cause.body)}`
      );

      throw new Error(`API Call failed with status: ${error.cause.status}`, {
        cause: error.cause.status,
      });
    }
  }

  protected abstract processResponse<T>(
    res: Response
  ): Promise<P extends Promise<unknown> ? T : ReadableStream<T> | null>;

  public addContentType(contentType: ContentType) {
    const headers = new Headers(this.config?.headers);
    headers.append('Content-Type', contentType);

    this.config = { ...this.config, headers };

    return this;
  }

  public addBearerAuth(authToken: string) {
    const headers = new Headers(this.config?.headers);
    headers.append('Authorization', `Bearer ${authToken}`);

    this.config = { ...this.config, headers };

    return this;
  }

  public addBody(body: object) {
    try {
      this.config = { ...this.config, body: JSON.stringify(body) };
    } catch (error) {
      assertIsError(error);

      throw new Error(
        'Something went wrong trying to add the Body to the API Request'
      );
    }

    return this;
  }

  public addMethod(method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE') {
    this.config = { ...this.config, method };

    return this;
  }
}
