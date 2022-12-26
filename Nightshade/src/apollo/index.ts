import http from 'http';
import {
  expressMiddleware,
  ExpressContextFunctionArgument,
} from '@apollo/server/express4';
import { container } from 'tsyringe';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

export * from './resolvers';
export * from './typeDefs';

export class Apollo {
  server: ApolloServer;
  httpServer: http.Server;

  constructor(typeDefs: any, query: any, mutation: any) {
    this.httpServer = container.resolve('Server');
    this.server = new ApolloServer({
      typeDefs,
      resolvers: { Query: { ...query }, Mutation: { ...mutation } },
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
      ],
    });
  }

  async context({ req }: ExpressContextFunctionArgument): Promise<object> {
    return { req };
  }

  ApolloMiddleware(): any {
    return expressMiddleware(this.server, {
      context: this.context,
    });
  }

  async start(): Promise<void> {
    await this.server.start();
  }
}
