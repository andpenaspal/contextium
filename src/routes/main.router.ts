import { Router } from 'express';

import type { BaseRouter } from 'src/routes/routers/baseRouter';

export type RouterConfig = { path: string; router: BaseRouter };

export class MainRouter {
  private router: Router;

  constructor(routers: RouterConfig[]) {
    this.router = this.initializeRouter(routers);
  }

  private initializeRouter(routers: RouterConfig[]) {
    const mainRouter = Router();

    routers.forEach((routerConfig) =>
      mainRouter.use(routerConfig.path, routerConfig.router.getRouter())
    );

    return mainRouter;
  }

  public getRouter() {
    return this.router;
  }
}
