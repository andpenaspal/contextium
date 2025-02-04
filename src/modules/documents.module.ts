import { DocumentsRouter } from 'src/routes/routers/documents.router';

import { DocumentController } from 'src/controllers/document.controller';

import { DocumentService } from 'src/services/document/document.service';

export class DocumentsModule {
  private documentsService: DocumentService;
  private documentsController: DocumentController;
  private documentsRouter: DocumentsRouter;

  constructor() {
    this.documentsService = new DocumentService();
    this.documentsController = new DocumentController(this.documentsService);
    this.documentsRouter = new DocumentsRouter(this.documentsController);
  }

  public getRouter() {
    return this.documentsRouter;
  }
}
