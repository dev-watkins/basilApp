import { z } from 'zod';

export * from './register.request';

export const requestValidator = (
  schema: z.AnyZodObject,
  request: object
): void => {
  schema.parse(request);
};
