import { Router } from 'express';

export abstract class BaseRouter {
  protected router: Router;

  constructor() {
    this.router = Router();
    this.registerRoutes(); // Ensure each router calls this method
  }

  protected abstract registerRoutes(): void;

  public getRouter(): Router {
    return this.router;
  }
}
