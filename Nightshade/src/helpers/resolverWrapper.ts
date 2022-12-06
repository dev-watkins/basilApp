import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ZodError } from 'zod';
import { GraphQLError } from 'graphql';
import { REQUEST_VALIDATION_ERROR, DATABASE_REQUEST_ERROR } from '../framework';

export const resolverWrapper = async (resolver: any) => {
  try {
    return await resolver();
  } catch (err) {
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
    } else {
      throw new GraphQLError('Internal Server Error', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }
};
