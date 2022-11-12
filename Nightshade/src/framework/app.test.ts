import express, { Express, Router } from 'express';
import 'reflect-metadata';
import { App } from './app';

describe('App test', () => {
  it('should initialize express app', () => {
    const expressFunc = jest.fn(() => express()) as () => Express;
    const app = new App(expressFunc);
    expect(app.app).toBeDefined();
    expect(expressFunc).toBeCalledTimes(1);
  });

  it('should call app.use to add middleware', () => {
    const expressFunc = jest.fn(() => {
      return {
        use: jest.fn(),
      };
    }) as unknown as () => Express;
    const app = new App(expressFunc);
    app.attachMiddleware('/', jest.fn());

    expect(app.app.use).toBeCalledTimes(1);
  });

  it('should throw an error because of falsy path', () => {
    const expressFunc = jest.fn() as () => Express;
    const app = new App(expressFunc);

    expect(() => app.attachMiddleware('', jest.fn())).toThrow(
      'path cannot be falsy'
    );
  });

  it('should call app.use to add route', () => {
    const expressFunc = jest.fn(() => {
      return {
        use: jest.fn(),
      };
    }) as unknown as () => Express;
    const app = new App(expressFunc);
    app.attachRouter('/', jest.fn() as unknown as Router);

    expect(app.app.use).toBeCalledTimes(1);
  });

  it('should throw an error because of falsy path', () => {
    const expressFunc = jest.fn() as () => Express;
    const app = new App(expressFunc);

    expect(() => app.attachRouter('', jest.fn() as unknown as Router)).toThrow(
      'path cannot be falsy'
    );
  });
});
