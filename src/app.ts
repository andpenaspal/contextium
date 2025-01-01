import dotenv from 'dotenv';
import express from 'express';

import { ContextiumApplication } from 'src/contextiumApp';

import { MainRouter, type RouterConfig } from 'src/routes/main.router';
import { BasePaths } from 'src/routes/paths';
import { ConfigRouter } from 'src/routes/routers/config.router';

dotenv.config();

const routers: RouterConfig[] = [
  { path: BasePaths.config, router: new ConfigRouter() },
];

const mainRouter = new MainRouter(routers).getRouter();

const contextiumApp = new ContextiumApplication(express(), mainRouter);

export const expressApp = contextiumApp.getExpressApplication();
export const server = contextiumApp.listen();
