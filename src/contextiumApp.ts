import cors from 'cors';
import express, { Application, type Router } from 'express';

import { BASE_PATH } from 'src/routes/paths';

export class ContextiumApplication {
  private app: Application;
  private SERVER_PORT = process.env.SERVER_PORT || 3000;

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
