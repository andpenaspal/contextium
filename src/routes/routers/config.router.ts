import { type Response, type Request } from 'express';

import { HuggingFaceIntegration } from 'src/clients/integrations/huggingface.integration';

import { CONFIG_PATHS } from '../paths';
import { BaseRouter } from './baseRouter';

export class ConfigRouter extends BaseRouter {
  constructor() {
    super();
  }

  protected registerRoutes() {
    this.router.get(CONFIG_PATHS.ping, (_req: Request, res: Response) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      new HuggingFaceIntegration().test();
      res.status(200).json({ ping: true });
    });
  }
}
