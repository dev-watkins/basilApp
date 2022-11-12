import { userResolver } from './userResolver';
export * from './userResolver';

export const query = {
  ...userResolver,
};
