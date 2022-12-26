import { userQueryResolver } from './user.query.resolver';
import { userMutationResolver } from './user.mutation.resolver';
export * from './user.query.resolver';
export * from './user.mutation.resolver';

export const query = {
  ...userQueryResolver,
};

export const mutation = {
  ...userMutationResolver,
};
