import cors from 'cors';
import express, { type Application, type Router } from 'express';

import { BASE_PATH } from 'src/routes/paths';

export class ApiServer {
  private app: Application;

  constructor(mainRouter: Router) {
    const app = express();
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

  public getApiServerInstance() {
    return this.app;
  }
}
