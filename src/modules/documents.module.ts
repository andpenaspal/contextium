import { HuggingFaceIntegration } from 'src/clients/integrations/huggingface.integration';

import { DocumentsRouter } from 'src/routes/routers/documents.router';

import { DocumentController } from 'src/controllers/document.controller';

import { DocumentService } from 'src/services/document/document.service';

export class DocumentsModule {
  private documentsRouter: DocumentsRouter;

  constructor() {
    const documentsController = new DocumentController(
      new DocumentService(),
      new HuggingFaceIntegration()
    );

    this.documentsRouter = new DocumentsRouter(documentsController);
  }

  public getRouter() {
    return this.documentsRouter;
  }
}
