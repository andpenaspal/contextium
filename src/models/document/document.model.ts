export class Document {
  private id: number;
  private title: string;

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }

  getId(): number {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }
}
