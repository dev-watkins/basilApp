import express, { Express, Router } from 'express';
import { singleton } from 'tsyringe';

interface IApp {
  app: Express;
  attachMiddleware: (path: string, ...rest: any[]) => void;
  attachRouter: (path: string, router: Router) => void;
}

@singleton()
export class App implements IApp {
  app: Express;

  constructor(exApp: () => Express = express) {
    this.app = exApp();
  }

  attachMiddleware(path: string, ...rest: any[]): void {
    if (path === '') throw new Error('path cannot be falsy');
    this.app.use(path, ...rest);
  }

  attachRouter(path: string, router: Router): void {
    if (path === '') throw new Error('path cannot be falsy');
    this.app.use(path, router);
  }
}
