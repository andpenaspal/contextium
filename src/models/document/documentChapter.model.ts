export class DocumentChapter {
  private id: number;
  private documentId: number;
  private title: string;

  constructor(id: number, documentId: number, title: string) {
    this.id = id;
    this.documentId = documentId;
    this.title = title;
  }

  getId(): number {
    return this.id;
  }

  getDocumentId(): number {
    return this.documentId;
  }

  getTitle(): string {
    return this.title;
  }
}
