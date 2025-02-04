export class DocumentSection {
  private id: number;
  private embeddings: number[];
  private chapterId: number;
  private content: string;

  constructor(
    id: number,
    embeddings: number[],
    chapterId: number,
    content: string
  ) {
    this.id = id;
    this.embeddings = embeddings;
    this.chapterId = chapterId;
    this.content = content;
  }

  getId(): number {
    return this.id;
  }

  getEmbeddings(): number[] {
    return this.embeddings;
  }

  getChapterId(): number {
    return this.chapterId;
  }

  getContent(): string {
    return this.content;
  }
}
