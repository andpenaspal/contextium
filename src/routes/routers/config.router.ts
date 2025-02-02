import { type Response, type Request } from 'express';

import type { ConfigController } from 'src/controllers/config.controller';

import { CONFIG_PATHS } from '../paths';
import { BaseRouter } from './baseRouter';

export class ConfigRouter extends BaseRouter {
  private configController: ConfigController;

  constructor(configController: ConfigController) {
    super();
    this.configController = configController;
  }

  protected registerRoutes() {
    this.router.get(CONFIG_PATHS.ping, (_req: Request, res: Response) => {
      res.status(200).json({ ping: this.getPing() });
    });
  }

  private getPing() {
    return this.configController.ping();
  }
}
