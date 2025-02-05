export abstract class GenAiIntegration {
  protected baseUrl: string;
  protected queryModel: string;
  protected queryUrl: string;
  protected embeddingsUrl: string;
  protected apiToken: string;

  constructor(
    baseUrl: string,
    queryModel: string,
    queryUrl: string,
    embeddingsUrl: string,
    apiToken: string
  ) {
    this.baseUrl = baseUrl;
    this.queryModel = queryModel;
    this.queryUrl = `${baseUrl}${queryUrl}`;
    this.embeddingsUrl = `${baseUrl}${embeddingsUrl}`;
    this.apiToken = apiToken;
  }

  public abstract queryStream(
    query: string
  ): Promise<ReadableStream<Uint8Array>>;

  public abstract processStream(
    stream: ReadableStream<Uint8Array>,
    onChunk?: (content: string) => void
  ): Promise<string>;

  public abstract query(query: string): Promise<string | undefined>;

  public abstract generateEmbeddings(content: string[]): Promise<number[][]>;
}
