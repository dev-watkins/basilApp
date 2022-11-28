import http from 'http';
import { singleton, container } from 'tsyringe';
import { App } from './app';

interface IServer {
  server: http.Server;
  expressApp: App;
  start: () => Promise<void>;
}

@singleton()
export class Server implements IServer {
  server: http.Server;
  expressApp: App;

  constructor() {
    this.expressApp = container.resolve<App>('App');
    this.server = http.createServer(this.expressApp.app);
  }

  async start(): Promise<void> {
    try {
      const port = process.env.PORT ?? 3000;

      await this.server.listen({ port });
      console.log(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Nightshade Server ready at ${process.env.HOST}:${port}/`
      );
      console.log(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Apollo Server ready at ${process.env.HOST}:${port}/graphql`
      );
    } catch (e) {
      throw new Error(e as string);
    }
  }
}
