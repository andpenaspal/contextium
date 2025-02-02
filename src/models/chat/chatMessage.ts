export class ChatMessage {
  private _content: string;

  constructor(content: string) {
    this._content = content;
  }

  get content() {
    return this._content;
  }
}
