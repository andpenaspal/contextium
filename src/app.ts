import cors from 'cors';
import express, { Application, type Router } from 'express';

import { MainRouter, type RouterConfig } from 'src/routes/main.router';
import { BASE_PATH, BasePaths } from 'src/routes/paths';
import { ConfigRouter } from 'src/routes/routers/config.router';

class ContextiumApplication {
  private app: Application;
  private SERVER_PORT = process.env.PORT || 3000;

  constructor(app: Application, mainRouter: Router) {
    this.initializeMiddlewares(app);
    this.initializeRouter(app, mainRouter);

    this.app = app;
  }

  private initializeMiddlewares(app: Application) {
    app.use(cors());
    app.use(express.json());
  }

  private initializeRouter(app: Application, mainRouter: Router) {
    app.use(BASE_PATH, mainRouter);
  }

  public getExpressApplication() {
    return this.app;
  }

  public listen() {
    return this.app.listen(this.SERVER_PORT, () =>
      console.log(`Server running on port ${this.SERVER_PORT}`)
    );
  }
}

const routers: RouterConfig[] = [
  { path: BasePaths.config, router: new ConfigRouter() },
];

const mainRouter = new MainRouter(routers).getRouter();

const contextiumApp = new ContextiumApplication(express(), mainRouter);

export const expressApp = contextiumApp.getExpressApplication();
export const server = contextiumApp.listen();
