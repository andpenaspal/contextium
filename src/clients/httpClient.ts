/* eslint-disable @typescript-eslint/naming-convention */
import { assertIsError } from 'src/utils/error';

export const ContentType = {
  applicationJson: 'application/json',
  textPlain: 'text/plain',
} as const;

type ContentType = (typeof ContentType)[keyof typeof ContentType];

export class HttpClient {
  private url: string | undefined;
  private config: RequestInit | undefined;

  constructor(init: Partial<RequestInit & { url: string }> = {}) {
    const { url, headers, ...initConfig } = init;
    this.url = url;
    this.config = { ...initConfig, headers: new Headers(headers) };
  }

  public async fetchCall<T>(
    url?: string,
    config?: RequestInit
  ): Promise<T | null> {
    const apiUrl = url ?? this.url;
    const apiConfig = config ?? this.config;

    if (!apiUrl) throw new Error('No Url for Fetch Call');

    const res = await fetch(apiUrl, apiConfig);

    return await this.processResponse<T | null>(res);
  }

  private async processResponse<T>(res: Response): Promise<T | null> {
    const contentType = res.headers.get('Content-Type');
    if (!contentType) return null;

    try {
      if (contentType === ContentType.applicationJson)
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return await (res.json() as Promise<T>);

      if (contentType === ContentType.textPlain)
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return await (res.text() as Promise<T>);
    } catch (error: unknown) {
      const msg = `Error Processing Response for Content Type: ${contentType}.`;

      assertIsError(error, msg);

      throw new Error(`${msg} Error: ${error.message}`);
    }

    throw new Error(`Content Type not supported: ${contentType}`);
  }

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
