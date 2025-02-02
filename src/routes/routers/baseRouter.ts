import { Router } from 'express';

export abstract class BaseRouter {
  protected router: Router;

  constructor() {
    this.router = Router();
  }

  protected abstract registerRoutes(): void;

  public getRouter(): Router {
    this.registerRoutes();
    return this.router;
  }
}
