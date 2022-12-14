import * as dotenv from 'dotenv';
import 'reflect-metadata';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { App, Server } from './framework';
import { Apollo, typeDefs, query, mutation } from './apollo';
import prisma from './helpers/client';
import { UserRepository, ClientAppRepository } from './repositories';
import {
  UserService,
  MailService,
  VerificationService,
  ClientAppService,
} from './services';

export async function bootstrap(): Promise<void> {
  dotenv.config();

  // build express app
  const app = new App();

  // Register dependencies
  container.register<PrismaClient>('PrismaClient', {
    useValue: prisma,
  });

  container.register<App>('App', {
    useValue: app,
  });

  container.register<MailService>('MailService', {
    useValue: new MailService(),
  });

  container.register<VerificationService>('VerificationService', {
    useValue: new VerificationService(),
  });

  container.register<UserRepository>('UserRepository', {
    useValue: new UserRepository(),
  });

  container.register<ClientAppRepository>('ClientAppRepository', {
    useValue: new ClientAppRepository(),
  });

  container.register<UserService>('UserService', {
    useValue: new UserService(),
  });

  container.register<ClientAppService>('ClientAppService', {
    useValue: new ClientAppService(),
  });

  // build http server
  const httpServer = new Server();

  container.register<http.Server>('Server', {
    useValue: httpServer.server,
  });

  // build apollo server
  const apollo = new Apollo(typeDefs, query, mutation);
  await apollo.start();

  // attach middleware
  app.attachMiddleware(
    '/graphql',
    cors(),
    bodyParser.json(),
    apollo.ApolloMiddleware()
  );

  await httpServer.start();
}

bootstrap()
  .then(() => {})
  .catch((e) => {
    console.log(e);
  });
