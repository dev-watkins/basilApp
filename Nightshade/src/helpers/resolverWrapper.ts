import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ZodError } from 'zod';
import { GraphQLError } from 'graphql';
import {
  REQUEST_VALIDATION_ERROR,
  DATABASE_REQUEST_ERROR,
  UNAUTHORIZED_CLIENT,
  UnauthorizedClient,
  ClientAppNotFound,
} from '../framework';
import { logger } from './logger';

export const resolverWrapper = async (
  resolver: () => Promise<any>,
  middleware?: Array<() => any>
): Promise<any> => {
  try {
    if (middleware) await Promise.all(middleware?.map((mw) => mw()));
    return await resolver();
  } catch (err) {
    logger.error(err);
    if (err instanceof ZodError) {
      throw new GraphQLError('Request validation error', {
        extensions: {
          code: REQUEST_VALIDATION_ERROR,
          errors: err,
        },
      });
    } else if (err instanceof PrismaClientKnownRequestError) {
      throw new GraphQLError('Invalid database request', {
        extensions: {
          code: DATABASE_REQUEST_ERROR,
        },
      });
    } else if (err instanceof UnauthorizedClient) {
      throw new GraphQLError(
        'Client is not authenticated please provide a valid clientId and secret',
        {
          extensions: {
            code: UNAUTHORIZED_CLIENT,
          },
        }
      );
    } else if (err instanceof ClientAppNotFound) {
      throw new GraphQLError('Client id not found', {
        extensions: { code: UNAUTHORIZED_CLIENT },
      });
    } else {
      throw new GraphQLError('Internal Server Error', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }
};
