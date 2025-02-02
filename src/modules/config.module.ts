import { ConfigRouter } from 'src/routes/routers/config.router';

import { ConfigController } from 'src/controllers/config.controller';

export class ConfigModule {
  private configController: ConfigController;
  private configRouter: ConfigRouter;

  constructor() {
    this.configController = new ConfigController();
    this.configRouter = new ConfigRouter(this.configController);
  }

  public getRouter() {
    return this.configRouter;
  }
}
