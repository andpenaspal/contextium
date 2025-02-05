import { type Response, type Request } from 'express';

import { assertIsError } from 'src/utils/error';
import logger from 'src/utils/logger';

import type { DocumentController } from 'src/controllers/document.controller';

import { BaseRouter } from './baseRouter';

export class DocumentsRouter extends BaseRouter {
  private DocumentsController: DocumentController;

  constructor(documentsController: DocumentController) {
    super();
    this.DocumentsController = documentsController;
  }

  protected registerRoutes() {
    this.router.post('', async (req: Request, res: Response) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-member-access
      const documentName = req.body.documentName as string;

      try {
        const documentId = await this.postDocuments(documentName);

        res.status(200).json({ documentId });
      } catch (error) {
        const msg = `while trying to create a Document for the document: ${documentName}`;
        assertIsError(error);
        logger.error(`Something went wrong ${msg}. Error: ${error.message}`);
        res.status(500).json(JSON.stringify({ error: 'Server Error' }));
      }
    });
  }

  private async postDocuments(documentName: string) {
    return await this.DocumentsController.createEmbeddedDocument(documentName);
  }
}
