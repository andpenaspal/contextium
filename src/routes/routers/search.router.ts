import { type Response, type Request } from 'express';

import { assertIsError } from 'src/utils/error';
import logger from 'src/utils/logger';

import type { SearchController } from 'src/controllers/search.controller';

import { BaseRouter } from './baseRouter';

export class SearchRouter extends BaseRouter {
  private searchController: SearchController;

  constructor(searchController: SearchController) {
    super();
    this.searchController = searchController;
  }

  protected registerRoutes() {
    this.router.post('', async (req: Request, res: Response) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-member-access
      const searchContent = req.body.searchContent as string;

      if (!searchContent) throw new Error('No "searchContent" in body');

      try {
        const response = await this.postSearch(searchContent);

        res.status(200).json({ response });
      } catch (error) {
        const msg = `while trying to perform a Search`;
        assertIsError(error);
        logger.error(`Something went wrong ${msg}. Error: ${error.message}`);
        res.status(500).send('Unexpected Error');
      }
    });
  }

  private async postSearch(searchContent: string) {
    return await this.searchController.searchContent(searchContent);
  }
}
