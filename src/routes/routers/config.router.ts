import { Request, Response } from 'express';

import { configPaths } from '../paths';
import { BaseRouter } from './baseRouter';

export class ConfigRouter extends BaseRouter {
  constructor() {
    super();
  }

  protected registerRoutes() {
    this.router.get(configPaths.ping, (req: Request, res: Response) => {
      res.status(200).json({ ping: true });
    });
  }
}
