import { z } from 'zod';

export * from './register.request';

export const requestValidator =
  (schema: z.AnyZodObject, request: object) => () => {
    schema.parse(request);
  };
