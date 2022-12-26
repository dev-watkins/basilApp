import 'reflect-metadata';
import http from 'http';
import { container } from 'tsyringe';
import { Server } from './server';

describe('Server tests', () => {
  it('should initialize an http server', () => {
    const httpSpy = jest.spyOn(http, 'createServer');
    container.register('App', {
      useValue: jest.fn(() => {
        return {};
      }),
    });
    const expressServer = new Server();
    expect(httpSpy).toBeCalled();
    expect(expressServer.expressApp).toBeDefined();
  });

  it('should call server listen method with default port', async () => {
    container.register('App', {
      useValue: jest.fn(() => {
        return {};
      }),
    });
    const expressServer = new Server();
    expressServer.server.listen = jest.fn().mockResolvedValueOnce('');
    await expressServer.start();
    expect(expressServer.server.listen).toBeCalled();
  });

  it('should call server listen method', async () => {
    container.register('App', {
      useValue: jest.fn(() => {
        return {};
      }),
    });
    const expressServer = new Server();
    expressServer.server.listen = jest.fn().mockResolvedValueOnce('');
    process.env.PORT = '4000';
    await expressServer.start();
    expect(expressServer.server.listen).toBeCalled();
  });

  it('should throw error if call to server listen method fails', async () => {
    container.register('App', {
      useValue: jest.fn(() => {
        return {};
      }),
    });
    const expressServer = new Server();
    expressServer.server.listen = jest.fn().mockRejectedValueOnce('');
    await expect(expressServer.start()).rejects.toThrow();
  });
});
