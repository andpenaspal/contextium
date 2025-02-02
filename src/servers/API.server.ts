import cors from 'cors';
import express, { type Application, type Router } from 'express';

import { BASE_PATH } from 'src/routes/paths';

export class ApiServer {
  constructor(application: Application, mainRouter: Router) {
    this.initializeMiddlewares(application);
    this.initializeRouter(application, mainRouter);
  }

  private initializeMiddlewares(app: Application) {
    app.use(cors());
    app.use(express.json());
  }

  private initializeRouter(app: Application, mainRouter: Router) {
    app.use(BASE_PATH, mainRouter);
  }
}
