import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from '@apollo/server';
import { UserRepository } from '../repositories';
import { VerificationService, MailService, UserService } from '../services';
import prisma from '../helpers/client';
import { typeDefs, query, mutation } from '../apollo';
import { REQUEST_VALIDATION_ERROR, DATABASE_REQUEST_ERROR } from '../framework';

let server: ApolloServer<any>;
beforeAll(() => {
  // Register dependencies
  container.register<PrismaClient>('PrismaClient', {
    useValue: prisma,
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

  container.register<UserService>('UserService', {
    useValue: new UserService(),
  });

  server = new ApolloServer({
    typeDefs,
    resolvers: { Query: { ...query }, Mutation: { ...mutation } },
  });
});

beforeAll(async () => {
  await prisma.user.create({
    data: {
      email: 'test@test.com',
      name: 'test user',
      phoneNumber: '9189181234',
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['matthewwatkins0@gmail.com', 'test@test.com'],
      },
    },
  });
});

describe('int tests for registering a user', () => {
  it('should register a unique user', async () => {
    const response = await server.executeOperation(
      {
        query:
          'mutation register($email: String!, $name: String!, $phoneNumber: String!){register(email: $email, name: $name, phoneNumber: $phoneNumber){id name}}',
        variables: {
          name: 'Matthew Watkins',
          email: 'matthewwatkins0@gmail.com',
          phoneNumber: '9189485963',
        },
      },
      {
        contextValue: {
          req: {
            headers: {
              client_id: '123',
              client_secret: '123',
            },
          },
        },
      }
    );

    // @ts-ignore
    console.log(response.body.singleResult);

    expect(response.body.kind).toEqual('single');
    // @ts-ignore
    expect(response.body.singleResult.errors).toBeUndefined();
    // @ts-ignore
    expect(response.body.singleResult.data).toBeDefined();
    // @ts-ignore
    expect(response.body.singleResult.data.register.id).toBeDefined();
    // @ts-ignore
    expect(response.body.singleResult.data.register.name).toEqual(
      'Matthew Watkins'
    );
  });

  it('should not register a user that already exists', async () => {
    const response = await server.executeOperation(
      {
        query:
          'mutation register($email: String!, $name: String!, $phoneNumber: String!){register(email: $email, name: $name, phoneNumber: $phoneNumber){id name}}',
        variables: {
          name: 'test user',
          email: 'test@test.com',
          phoneNumber: '9189181234',
        },
      },
      {
        contextValue: {
          req: {
            headers: {
              client_id: '123',
              client_secret: '123',
            },
          },
        },
      }
    );

    // @ts-ignore
    console.log(response.body.singleResult.errors);

    // @ts-ignore
    expect(response.body.singleResult.errors).toBeDefined();
    // @ts-ignore
    expect(response.body.singleResult.errors[0].extensions.code).toEqual(
      DATABASE_REQUEST_ERROR
    );
  });

  it('should not register user with invalid request', async () => {
    const response = await server.executeOperation(
      {
        query:
          'mutation register($email: String!, $name: String!, $phoneNumber: String!){register(email: $email, name: $name, phoneNumber: $phoneNumber){id name}}',
        variables: {
          name: 'test user',
          email: 'test',
          phoneNumber: '9189181234',
        },
      },
      {
        contextValue: {
          req: {
            headers: {
              client_id: '123',
              client_secret: '123',
            },
          },
        },
      }
    );

    // @ts-ignore
    console.log(response.body.singleResult.errors);

    // @ts-ignore
    expect(response.body.singleResult.errors).toBeDefined();
    // @ts-ignore
    expect(response.body.singleResult.errors[0].extensions.code).toEqual(
      REQUEST_VALIDATION_ERROR
    );
  });
});
