import { HuggingFaceIntegration } from 'src/clients/integrations/huggingface.integration';

import { SearchRouter } from 'src/routes/routers/search.router';

import { SearchController } from 'src/controllers/search.controller';

import { DocumentService } from 'src/services/document/document.service';
import { SearchService } from 'src/services/search.service';

export class SearchModule {
  private searchRouter: SearchRouter;

  constructor() {
    const searchController = new SearchController(
      new SearchService(),
      new DocumentService(),
      new HuggingFaceIntegration()
    );

    this.searchRouter = new SearchRouter(searchController);
  }

  public getRouter() {
    return this.searchRouter;
  }
}
